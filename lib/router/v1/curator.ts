import { Request, Response } from 'express';
import axios from 'axios';

import { log } from 'helpers/log';
import { connectToDb, getDataFromDB, findOption } from 'helpers/db';
import { sanitizeString } from 'helpers';

import { TGameEvent, TTierChangeEvent } from './types/events';
import { findGame } from './ranking';
import { updateStatus } from './update';

type TRating = {
  symbol: string;
  icon: string;
  score: number;
  description: string;
  id: string;
};
type TGame = {
  id: string;
  desc: string;
  rating: number;
  title?: string;
  img?: string;
  achievements?: {
    total: number;
    list: Array<number>;
  };
  url?: string;
  sale?: {
    onSale: boolean;
    discount: number;
  };
  curated: boolean;
  protected?: boolean;
};

const fillGameData = (id: any, desc: any, score: any) => ({
  id,
  desc,
  rating: score,
  curated: true,
});

/**
 * Returns all curated games
 */
export const getCuratorGames = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (res) {
      const games = await getDataFromDB('games');
      const users = await getDataFromDB('users');
      const badges = await getDataFromDB('badges');
      const filteredGames = games
        .filter((game: any) => game.curated || game.protected)
        .map((game: any) => {
          const { id, desc, rating, title, sale, img, url, curated } = game;
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
                playtime: Number(gameDetails?.playtime_forever),
                percentage: Number(gameDetails?.completionRate),
              };
            });
          const completions = filteredUsers.filter(
            (user: any) => user.percentage === 100,
          ).length;
          const avgPlaytime = filteredUsers
            .filter((user: any) => user.percentage === 100)
            .reduce((a: any, b: any) => a + b.playtime, 0);
          const gameBadges = badges.filter(
            (badge: any) => Number(badge.gameId) === Number(id),
          );
          const badgesPts = gameBadges
            .map((badge: any) => {
              if (!badge?.points || badge.points < 0) {
                return 0;
              }
              return Number(badge.points);
            })
            .reduce((a: any, b: any) => a + b, 0);
          const achievementsNr = game.achievements.total;
          const filteredBadges = badges
            .filter((badge: any) => Number(badge.gameId) === Number(id))
            .map((badge: any) => badge._id);
          return {
            id: typeof id !== 'number' ? Number(id) : id,
            desc,
            rating,
            title,
            img,
            url,
            sale,
            curated,
            protected: game.protected,
            badges: filteredBadges,
            stats: {
              completions,
              avgPlaytime: completions !== 0 ? avgPlaytime / completions : 0,
              badgesNr: gameBadges?.length ?? 0,
              badgesPts,
              achievementsNr,
            },
          };
        });
      res.status(200).send(filteredGames);
    }
  } catch (err) {
    if (res) {
      res.status(500).send(err);
    }
  }
};

/**
 * Returns all curated games from particular tier
 * @param req.params.tier
 */
export const getCuratedGamesFromTier = async (req: any, res: any) => {
  try {
    const games = await getDataFromDB('games', { rating: req.params.tier });
    res.status(200).send(games);
  } catch (err) {
    res.status(500).send(err);
  }
};

/**
 * Updates the list of curated games
 * @param req.headers.force_update - to force update all games
 */
export const updateCuratorGames = (_req?: any, res?: any): Promise<void> =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise(async resolve => {
    const { db } = await connectToDb();
    const curatorId = await findOption('curatorId');
    if (!curatorId) {
      res.sendStatus(500);
      return;
    }
    const urlCuratedGames = `http://store.steampowered.com/curator/${curatorId}-0.1%25/ajaxgetfilteredrecommendations/render?query=&start=0&count=1000&tagids=&sort=recent&types=0`;
    const points: Array<TRating> = await getDataFromDB('points');
    const gamesDB: Array<TGame> = await getDataFromDB('games');
    const response = await axios.get(urlCuratedGames);
    const games: Array<TGame> = [];

    if (!response || !response.data || !response.data.results_html) {
      if (res) {
        res.sendStatus(500);
      }
      return;
    }
    if (res) {
      res.status(202).send('Initiated UPDATE on curated games list.');
    }
    log.INFO('--> [UPDATE] curated games list');
    /*
        Downloads current curated games' list.
    */

    const DESC_QUOTE = 'recommendation_desc';

    const rawGameData = response.data.results_html.split('data-ds-appid=');
    rawGameData
      .filter((r: string) => r.includes(DESC_QUOTE))
      .map((r: any) => {
        const gameId = r
          .match(/(["'])(?:(?=(\\?))\2.)*?\1/g, '')[0]
          .replace(/"/g, '');
        const gameDesc = sanitizeString(
          r
            .match(/recommendation_desc([\s\S]*?)div/gs, '')[0]
            .replace(DESC_QUOTE, '')
            .replace('div', ''),
        );
        return { id: gameId, desc: gameDesc };
      })
      .map((game: { id: string; desc: string }) => {
        const scoreIsDefined = points.find(r =>
          game.desc.trim().startsWith(r.symbol),
        );
        const score = scoreIsDefined ? scoreIsDefined.id : '1';
        games.push(fillGameData(game.id, game.desc, score));
      });
    /*  
    Compares it with the games' list saved in database.
    Games which are not in database are updated now.
    All games get force updated in presence of force_update header.
    IMPORTANT!!! When force_update the flag protected is probably ignored!!!!!
  */
    // if (!req.headers || (req?.headers && !req.headers.force_update)) {
    //   games = games.filter((game: TGame) => {
    //     const gameIsNotInDb = !gamesDB.find(
    //       gameDB => Number(gameDB.id) === Number(game.id),
    //     );
    //     return gameIsNotInDb;
    //   });
    // }

    gamesDB
      .filter(
        (gameFromDb: TGame) =>
          !games.find(
            (newGameData: any) =>
              Number(newGameData.id) === Number(gameFromDb.id),
          ),
      )
      .map((decuratedGame: TGame) => {
        if (decuratedGame.protected || !decuratedGame.curated) {
          return;
        }
        const eventDetails: TGameEvent = {
          date: Date.now(),
          type: 'gameRemoved',
          game: decuratedGame.id,
        };
        db.collection('games').updateOne(
          { id: decuratedGame.id },
          {
            $set: {
              ...decuratedGame,
              curated: false,
            },
          },
          { upsert: true },
          err => {
            if (err) {
              log.WARN(err.message);
            } else {
              log.INFO(
                `--> [UPDATE] games - game ${
                  decuratedGame?.title ?? decuratedGame.id
                } decurated`,
              );
            }
          },
        );
        db.collection('events').insertOne(eventDetails, err => {
          if (err) {
            log.WARN(err.message);
          } else {
            log.INFO(
              `--> [UPDATE] events - game ${decuratedGame.id} decurated`,
            );
          }
        });
      });

    const gamesThatShouldNotGetDecurated = gamesDB.filter(
      (gameFromDb: TGame) =>
        !games.find(
          (newGameData: any) =>
            Number(newGameData.id) === Number(gameFromDb.id),
        ) && gameFromDb.protected,
    );

    games.push(...gamesThatShouldNotGetDecurated); // TODO this might be wrong

    const getGameDetails = async (index: number) => {
      const { client, db } = await connectToDb();
      const gameId = games[index].id;
      const urlGamesDetails = `http://store.steampowered.com/api/appdetails?appids=${gameId}`;
      const percentage = 20 + (60 / games.length) * (index + 1);
      let game;

      try {
        // eslint-disable-next-line prefer-const
        game = await axios.get(urlGamesDetails);
      } catch (err: any) {
        log.INFO(`- saving game ${gameId} failed`);
        log.INFO(`-- ${urlGamesDetails}`);
        log.WARN(err.message);
        if (games[index + 1]) {
          setTimeout(
            () => getGameDetails(index + 1),
            Number(process.env.DELAY),
          );
          return;
        } else {
          log.INFO('--> [UPDATE] curated games list [DONE]');
          resolve();
          return;
        }
      }

      const price = game.data[gameId]?.data?.price_overview;
      const gameDetails: TGame = {
        id: gameId,
        desc: games[index].desc,
        rating: games[index].rating,
        title: game.data[gameId].data?.name ?? games[index].title ?? 'unknown',
        img:
          game.data[gameId].data?.header_image ??
          games[index].img ??
          'https://cdn.iconscout.com/icon/premium/png-256-thumb/error-404-2824167-2343929.png',
        achievements: {
          total: game.data[gameId].data?.achievements?.total ?? 0,
          list: [],
        },
        url: urlGamesDetails,
        sale: {
          onSale: price ? (price.discount_percent ? true : false) : false,
          discount: price ? price.discount_percent : 0,
        },
        curated: true,
        protected: false,
      };

      const oldGame = gamesDB.find(
        gameDB => Number(gameDB.id) === Number(gameId),
      );
      if (oldGame) {
        gameDetails.protected = !!oldGame.protected;
      }
      if (oldGame && oldGame.rating !== games[index].rating) {
        log.INFO(`--> [UPDATE] events - game ${gameId} changed tier`);
        const eventDetails: TTierChangeEvent = {
          date: Date.now(),
          type: 'tierChange',
          game: gameId,
          oldTier: oldGame.rating,
          newTier: games[index].rating,
        };
        db.collection('events').insertOne(eventDetails, err => {
          if (err) {
            log.WARN(err.message);
          }
        });
      }
      const gameNewlyCurated = !oldGame;

      if (gameNewlyCurated) {
        const eventDetails: TGameEvent = {
          date: Date.now(),
          type: 'newGame',
          game: gameId,
        };
        db.collection('events').insertOne(eventDetails, err => {
          if (err) {
            log.WARN(err.message);
          }
        });
        log.INFO(`--> [UPDATE] events - game ${gameId} curated`);
      }

      updateStatus(db, percentage);
      db.collection('games').updateOne(
        { id: gameId },
        { $set: gameDetails },
        { upsert: true },
        err => {
          if (err) {
            // @ts-ignore:next-line
            log.INFO(
              `- saving game ${gameId} (${gameDetails?.title?.toUpperCase()}) failed`,
            );
            log.WARN(err.message);
            client.close();
          } else {
            // @ts-ignore:next-line
            log.INFO(
              `- [${index + 1}/${
                games.length
              }] - game ${gameId} (${gameDetails?.title?.toUpperCase()})`,
            );
            client.close();
          }
          if (games[index + 1]) {
            setTimeout(
              () => getGameDetails(index + 1),
              Number(process.env.DELAY),
            );
          } else {
            log.INFO('--> [UPDATE] curated games list [DONE]');
            resolve();
            return;
          }
        },
      );
    };
    log.INFO('--> [UPDATE] getting game details...');
    getGameDetails(0);
  });

const extractMemberIDs = (raw: any) => {
  const rawMembers = raw
    .toString()
    .substring(raw.indexOf('<steamID64>'), raw.indexOf('</members>'));
  const memberIDs = rawMembers.split('</steamID64>');
  return memberIDs
    .map((id: any) => {
      const memberID = id
        .replace('</steamID64>', '')
        .replace('<steamID64>', '')
        .replace('\r\n', '');
      return {
        name: '',
        avatar: '',
        url: `https://steamcommunity.com/profiles/${memberID}`,
        games: [],
        ranking: [],
        badges: [],
        private: false,
        updated: 0,
        member: true,
        id: memberID,
      };
    })
    .filter((m: any) => m.id.length > 0);
};

export const getCuratorMembers = (_req?: any, res?: any): Promise<void> =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise(async (resolve, reject) => {
    const curatorId = await findOption('curatorId');
    if (!curatorId) {
      res.sendStatus(500);
      return;
    }
    const url = `http://steamcommunity.com/gid/${curatorId}/memberslistxml/?xml=1`;
    log.INFO('--> [UPDATE] curator members list [START]');
    axios
      .get(url)
      .then(curator => {
        const members = extractMemberIDs(curator.data);
        resolve(members);
        if (res) {
          res.send(members);
        }
        log.INFO('--> [UPDATE] curator members list [DONE]');
      })
      .catch(err => {
        reject(err);
        if (res) {
          res.status(500).send(err);
        }
        log.WARN('--> [UPDATE] curator members list [ERROR]');
        log.WARN(err.message);
      });
  });
