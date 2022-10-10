import { Request, Response } from 'express';
import { orderBy } from 'lodash';
import { ObjectId } from 'mongodb';
import { getDataFromDB } from 'helpers/db';
import { TUser, TPoints } from './types/ranking';
import { TBadge } from './types/badges';

/**
 * Returns basic info about ranking.
 */
export const getRanking = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    // TODO users: remove games.achievements from database
    // change games.playtime_forever type to Number
    // rename games.playtime_forever => games.playtime
    // change ranking to ranking [ { tier: number, sum: number } ]

    // TODO patreon: rename steamid to steamId or just id
    const users = await getDataFromDB('users');
    const patrons = await getDataFromDB('patrons');
    const badges = await getDataFromDB('badges');
    const rating = await getDataFromDB('points');
    const filteredUsers: TUser[] = users
      .filter((user: any) => (user.member || user.protected) && !user.removed)
      .map((user: any) => {
        const id = user.id;
        const pointsList: TPoints[] = Object.entries(user.ranking).map(
          entry => {
            const tier =
              typeof entry[0] !== 'number' ? Number(entry[0]) : entry[0];
            const score = rating.find((t: any) => {
              const tierId = typeof t.id !== 'number' ? Number(t.id) : t.id;
              return tierId === tier;
            })?.score;
            const total =
              typeof entry[1] !== 'number' ? Number(entry[1]) : entry[1];
            const points = Number(score) * total;
            return {
              tier,
              total,
              points,
            };
          },
        );
        const filteredBadges = user.badges.filter((userBadge: any) => {
          const userBadgeId = new ObjectId(userBadge.id);
          const badgeExists = badges.find((badge: TBadge) =>
            userBadgeId.equals(badge._id),
          );
          if (badgeExists) {
            return true;
          } else {
            return false;
          }
        });
        const badgesPoints: number = filteredBadges
          .map((userBadge: any) => {
            const userBadgeId = new ObjectId(userBadge.id);
            const badgeObject = badges.find((badge: TBadge) =>
              userBadgeId.equals(badge._id),
            );
            const badgeValue = Number(badgeObject?.points);
            return badgeValue ? badgeValue : 0;
          })
          .reduce((a: number, b: number) => a + b, 0);
        const badgesTotal = filteredBadges.length;
        const sum = pointsList
          .map(tier => tier.points)
          .reduce((a: number, b: number) => a + b, 0);
        const points = {
          sum: badgesPoints + sum,
          list: pointsList,
          badges: {
            points: badgesPoints,
            total: badgesTotal,
          },
        };
        const isPatron = patrons.find((patron: any) => patron.steamid === id);
        const patreon = { tier: isPatron && Number(isPatron.tier) };
        return { id, points, patreon };
      });
    const orderedUsers = orderBy(
      filteredUsers,
      [user => (user?.points?.sum ? user.points.sum : 0)],
      ['desc'],
    );
    res.status(200).send(orderedUsers);
  } catch (err) {
    res.status(500).send(err);
  }
};

/**
 * Returns one user's ranking data.
 */
export const getUserRanking = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.id;
    const rawUser = await getDataFromDB('users', { id });

    if (rawUser.length === 0) {
      res.sendStatus(404);
      return;
    }

    const filteredUser = {
      id: req.params.id,
      private: rawUser[0].private,
      member: rawUser[0].member,
      badges: rawUser[0].badges,
      games: rawUser[0].games.map((game: any) => {
        const playtime =
          typeof game.playtime_forever !== 'number'
            ? Number(game.playtime_forever)
            : game.playtime_forever;
        const percentage =
          typeof game.completionRate !== 'number'
            ? Number(game.completionRate)
            : game.completionRate;
        const lastUnlocked =
          typeof game.lastUnlocked !== 'number'
            ? Number(game.lastUnlocked)
            : game.lastUnlocked;
        const gameId =
          typeof game.appid !== 'number' ? Number(game.appid) : game.appid;
        return { id: gameId, playtime, percentage, lastUnlocked };
      }),
    };

    res.status(200).send(filteredUser);
  } catch (err) {
    res.status(500).send(err);
  }
};

/**
 * Returns info about one singular leaderboards data.
 */
export const getGameLeaderboards = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id =
      typeof req.params.id !== 'number' ? Number(req.params.id) : req.params.id;
    const games = await getDataFromDB('games');
    const users = await getDataFromDB('users');
    const badges = await getDataFromDB('badges');
    const game = games.find((g: any) => Number(g.id) === id);
    if (!game) {
      res.sendStatus(404);
      return;
    }
    const filteredBadges = badges
      .filter((badge: any) => {
        const badgeGameId =
          typeof badge.gameId !== 'number'
            ? Number(badge.gameId)
            : badge.gameId;
        return badgeGameId === id;
      })
      .map((badge: any) => badge._id);
    const filteredUsers = users
      .filter(
        (user: any) =>
          (user.protected || user.member) &&
          !user.removed &&
          findGame(user, id),
      )
      .map((user: any) => {
        const gameDetails = findGame(user, id);
        return {
          id: user.id,
          playtime:
            typeof gameDetails?.playtime_forever !== 'number'
              ? Number(gameDetails?.playtime_forever)
              : gameDetails?.playtime_forever,
          percentage:
            typeof gameDetails?.completionRate !== 'number'
              ? Number(gameDetails?.completionRate)
              : gameDetails?.completionRate,
          lastUnlocked:
            typeof gameDetails?.lastUnlocked !== 'number'
              ? Number(gameDetails?.lastUnlocked)
              : gameDetails?.lastUnlocked,
        };
      });
    const orderedUsers = orderBy(
      filteredUsers,
      ['percentage', 'lastUnlocked'],
      ['desc', 'asc'],
    );

    const usersWithTrophies = assignTrophies(orderedUsers);
    const completions = orderedUsers.filter(
      (user: any) => user.percentage === 100,
    ).length;
    const avgPlaytime = orderedUsers
      .filter((user: any) => user.percentage === 100)
      .reduce((a, b) => a + b.playtime, 0);

    // avg playtime for this tier
    const gameTier = game.rating;
    const gamesFromThisTier = games
      .filter((g: any) => (g.curated || g.protected) && g.rating === gameTier)
      .map((g: any) => g.id);

    const playtimesOfFinishedGames = users
      .filter((user: any) => (user.member || user.protected) && !user.removed)
      .map((user: any) =>
        user.games
          .filter(
            (g: any) =>
              g.completionRate === 100 &&
              gamesFromThisTier.find(
                (gFTT: any) => Number(gFTT) === Number(g.appid),
              ),
          )
          .map((g: any) => g.playtime_forever),
      );
    const flattenedPlaytimes = playtimesOfFinishedGames
      .flat()
      .map((playtime: any) => Number(playtime))
      .filter((playtime: number) => playtime > 0);
    const singlePlaytime = flattenedPlaytimes.reduce(
      (a: number, b: number) => a + b,
      0,
    );
    const avgPlaytimeForTier = Math.floor(
      singlePlaytime / flattenedPlaytimes.length,
    );

    res.status(200).send({
      id,
      completions,
      avgPlaytime: Math.floor(avgPlaytime / completions),
      avgPlaytimeForTier,
      badges: filteredBadges,
      players: usersWithTrophies,
    });
  } catch (err) {
    res.sendStatus(500);
  }
};

export const findGame = (user: any, gameId: any) =>
  user.games.find((userGame: any) => {
    const gameIdUser =
      typeof userGame.appid !== 'number'
        ? Number(userGame.appid)
        : userGame.appid;
    const gameIdNumber = typeof gameId !== 'number' ? Number(gameId) : gameId;
    return gameIdUser === gameIdNumber;
  });

const assignTrophies = (users: any): string | undefined =>
  users.map((user: any, index: number) => {
    if (user.percentage !== 100) {
      return user;
    }
    switch (index) {
      case 0:
        return { ...user, trophy: '🥇' };
      case 1:
        return { ...user, trophy: '🥈' };
      case 2:
        return { ...user, trophy: '🥉' };
      default:
        return user;
    }
  });

/**
 * Returns some info about game tiers - average playtime etc.
 * @param req
 * @param res
 */
export const getTierDetails = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    console.log('dupa');
  } catch (err) {
    res.sendStatus(500);
  }
};
