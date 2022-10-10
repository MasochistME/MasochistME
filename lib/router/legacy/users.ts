import { Request, Response } from 'express';
import axios from 'axios';

import cache from 'cache';
import { connectToDb, getDataFromDB } from 'helpers/db';
import { log } from 'helpers/log';

/**
 * Returns basic users' data.
 */
export const getUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await getDataFromDB('users');
    const filteredUsers = users
      .filter((user: any) => !user.removed)
      .map((user: any) => {
        const filteredBadges = user.badges.map((badge: any) => badge.id);
        return {
          ...user,
          badges: filteredBadges,
        };
      });
    res.status(200).send(filteredUsers);
  } catch (err) {
    res.status(500).send(err);
  }
};

/**
 * Gets user details.
 * @param req
 * @param res
 */
export const getUserDetails = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.steamid;
    const users = await getDataFromDB('users');
    const rawUser = users.find((user: any) => user.id === id);
    if (!rawUser) {
      res.sendStatus(404);
      return;
    }
    const { badges, games } = rawUser;
    const fixedGames = games.map((game: any) => ({
      appid: game.appid,
      playtime_forever: game.playtime_forever,
      completionRate: game.completionRate,
      lastUnlocked: game.lastUnlocked,
    }));
    res.status(200).send({ id, badges, games: fixedGames });
  } catch (err: any) {
    log.WARN(err.message);
    res.status(500).send(err);
  }
};

/**
 * Updates one particular user data.
 * @param req.params.id
 */
export const updateUser = async (req: any, res: any) => {
  // TODO remove badges that dont exist anymore
  const id = req.params.steamid;
  const curatedGames = await getDataFromDB('games');
  const userToUpdate = await getDataFromDB('users', { id });
  const userUrl = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAM_KEY}&steamids=${id}`;
  const { client, db } = await connectToDb();
  let userData;

  try {
    log.INFO(`--> [UPDATE] user ${id} [START]`);
    userData = await axios.get(userUrl);
  } catch (err: any) {
    res.status(500).send(err);
    log.WARN(`--> [UPDATE] user ${id} [ERROR]`);
    log.WARN(err.message);
    return;
  }
  if (!userData?.data?.response?.players) {
    res.status(500).send('Cannot update, retry in a few minutes');
    log.WARN(`--> [UPDATE] updating user ${id} [ERROR]`);
    return;
  }
  if (
    userToUpdate[0] &&
    userToUpdate[0].updated &&
    Date.now() - userToUpdate[0].updated < 3600000
  ) {
    res.status(202).send('This user had been updated less than an hour ago');
    log.WARN(`--> [UPDATE] updating user ${id} [INTERRUPTED]`);
    return;
  }
  if (cache.updating.length >= 4) {
    res
      .status(202)
      .send('Too many users are updating now - retry in a few minutes');
    log.WARN(`--> [UPDATE] updating user ${id} [INTERRUPTED]`);
    return;
  }
  if (cache.updating.find(updating => updating.user === id)) {
    res.status(202).send('This user is already being updated');
    log.WARN(`--> [UPDATE] updating user ${id} [INTERRUPTED]`);
    return;
  }
  res.status(202).send('Updating... refresh in a few minutes');
  cache.updating.push({
    user: id,
    progress: 0,
  });

  const gamesAsync = await getUserGames(id, curatedGames, userToUpdate);
  const rankingAsync = await getUserRanking(curatedGames, gamesAsync);

  userData = userData.data.response.players[0];
  const isUserPrivate = gamesAsync.length === 0 ? true : false;
  const user = {
    id,
    name: userData.personaname,
    avatar: userData.avatarfull,
    url: `https://steamcommunity.com/profiles/${id}`,
    games: gamesAsync,
    ranking: rankingAsync,
    badges: userToUpdate[0] ? userToUpdate[0].badges : [],
    private: isUserPrivate,
    updated: Date.now(),
    // member: false // TODO check if Steam user is member!!!
  };

  db.collection('users').updateOne(
    { id },
    { $set: isUserPrivate ? { private: true } : user },
    { upsert: true },
    err => {
      if (err) {
        log.WARN(`--> [UPDATE] user ${id} [ERROR]`);
        log.WARN(err.message);
      } else {
        const index = cache.updating.findIndex(user => user.user === id);
        const newCache = cache.updating.splice(index, 1);
        cache.updating = newCache;
        log.INFO(`--> [UPDATE] user ${id} [DONE]`);
      }
      client.close();
    },
  );
};

const getUserGames = async (
  userID: number,
  curatedGames: any,
  userToUpdate: any,
): Promise<any> => {
  log.INFO(`--> [UPDATE] games of user ${userID}`);

  const userGamesUrl = `https://steamcommunity.com/profiles/${userID}/games/?tab=all`;
  const userGamesFallbackUrl = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${process.env.STEAM_KEY}&steamid=${userID}`;

  const userGames = await axios.get(userGamesUrl);
  const userGamesFallback = await axios.get(userGamesFallbackUrl);

  if (!userGames.data && !userGamesFallback.data) {
    log.INFO(`- user ${userID} has their profile set to private`);
    return [];
  }

  let games = userGames.data.substring(userGames.data.indexOf('rgGames =') + 9);
  games = games.substring(0, games.indexOf('];') + 1).trim();
  try {
    games = JSON.parse(games);
  } catch (err) {
    if (userGamesFallback.data.response.games) {
      log.INFO('--> [UPDATE] game list [FALLBACK]');
      games = userGamesFallback.data.response.games;
    } else {
      log.INFO(`- user ${userID} has their profile set to private`);
      return [];
    }
  }

  games = games
    .filter(
      (game: any) =>
        !!curatedGames.find(
          (cachedgame: any) =>
            Number(cachedgame.id) === Number(game.appid) &&
            (cachedgame.curated || cachedgame.protected),
        ),
    )
    .map((game: any) => {
      return {
        appid: game.appid,
        playtime_forever: game.hours_forever
          ? game.hours_forever.replace(',', '')
          : game.playtime_forever
          ? game.playtime_forever / 60
          : 0,
      };
    });
  try {
    const withAchievements = await getUserAchievements(
      userID,
      games,
      userToUpdate,
    );
    return withAchievements;
  } catch (err: any) {
    log.WARN(err.message);
    return [];
  }
};

const getUserAchievements = (userID: number, games: any, userToUpdate: any) =>
  new Promise(resolve => {
    log.INFO(`--> achievements of user ${userID}`);

    const getAchievementsDetails = async (index: number) => {
      if (games[index]) {
        const gameID = games[index].appid;
        const url = `http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1/?appid=${gameID}&steamid=${userID}&key=${process.env.STEAM_KEY}&format=json`;
        let response;

        log.INFO(
          `-- [${index + 1}/${
            Object.keys(games).length
          }] game ${gameID} (user ${userID})`,
        );

        const updateIndex = cache.updating.findIndex(
          user => user.user === userID,
        );
        if (updateIndex && cache.updating[updateIndex]) {
          cache.updating[updateIndex].progress =
            (100 * (index + 1)) / Object.keys(games).length;
        }

        try {
          response = await axios.get(url);

          const numberOfAllAchievements =
            response.data.playerstats.achievements.length;
          const numberOfUnlockedAchievements =
            response.data.playerstats.achievements.filter(
              (achievement: any) => Number(achievement.achieved) === 1,
            ).length;
          let lastUnlocked = 0;
          response.data.playerstats.achievements.map((achievement: any) =>
            achievement.unlocktime > lastUnlocked
              ? (lastUnlocked = achievement.unlocktime)
              : null,
          );
          const completionRate =
            (100 * numberOfUnlockedAchievements) / numberOfAllAchievements;

          games[index].completionRate = completionRate;
          games[index].lastUnlocked = lastUnlocked;
          games[index].achievements =
            response.data.playerstats.achievements.filter(
              (achievement: any) => achievement.achieved === 1,
            );

          // event when 100%
          if (userToUpdate[0]) {
            //this user is not in database YET
            const userGames = userToUpdate[0].games.find(
              (g: any) => g.appid === gameID,
            );
            if (
              userGames &&
              userGames.completionRate !== 100 &&
              completionRate === 100
            ) {
              log.INFO(
                `--> [UPDATE] events - user ${userID} completed ${gameID}`,
              );
              const eventDetails = {
                date: lastUnlocked * 1000,
                type: 'complete',
                member: userID,
                game: gameID,
              };
              const { db } = await connectToDb();
              db.collection('events').insertOne(eventDetails);
            }
          }
        } catch (err: any) {
          log.WARN(
            `--> [${index + 1}/${
              Object.keys(games).length
            }] game ${gameID} (user ${userID}) - [ERROR] - ${url}`,
          );
          log.WARN(err.message);
          if (games[index + 1]) {
            setTimeout(
              () => getAchievementsDetails(index + 1),
              Number(process.env.DELAY),
            );
            return;
          } else {
            log.INFO(`--> [UPDATE] achievements for ${userID} [DONE]`);
            resolve(games);
            return;
          }
        }
      }

      if (games[index + 1]) {
        setTimeout(
          () => getAchievementsDetails(index + 1),
          Number(process.env.DELAY),
        );
      } else {
        log.INFO(`--> [UPDATE] achievements for ${userID} [DONE]`);
        resolve(games);
      }
    };
    getAchievementsDetails(0);
  });

const getUserRanking = (curatedGames: any, userGames: any) =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise(async resolve => {
    const ranking = {};
    let rating;
    try {
      rating = await getDataFromDB('points');
    } catch (err) {
      resolve(ranking);
    }
    //@ts-ignore
    rating.map((tier: unknown) => (ranking[tier.id] = 0));

    userGames
      .filter((game: any) => Number(game.completionRate) === Number(100))
      .map((filteredgame: any) => {
        const game = curatedGames.find(
          (cachedgame: any) =>
            Number(cachedgame.id) === Number(filteredgame.appid),
        );
        //@ts-ignore
        game && ranking[game.rating]
          ? //@ts-ignore
            (ranking[game.rating] += 1)
          : //@ts-ignore
            (ranking[game.rating] = 1);
      });
    resolve(ranking);
  });
