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
  req: Request,
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
      .filter(user => user.member || user.protected)
      .map(user => {
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
        const badgesPoints: number = user.badges
          .map((userBadge: any) => {
            const userBadgeId = ObjectId(userBadge.id);
            const badgeObject = badges.find((badge: TBadge) =>
              userBadgeId.equals(badge._id),
            );
            const badgeValue = Number(badgeObject?.points);
            return badgeValue ? badgeValue : 0;
          })
          .reduce((a: number, b: number) => a + b, 0);
        const badgesTotal = user.badges.length;
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
        const isPatron = patrons.find(patron => patron.steamid === id);
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
    res.status(err.code).send(err);
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
    const filteredUser = {
      id: req.params.id,
      games: rawUser[0].games.map(game => {
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
        return { id: game.id, playtime, percentage, lastUnlocked };
      }),
    };

    res.status(200).send(filteredUser);
  } catch (err) {
    res.status(500).send(err);
  }
};
