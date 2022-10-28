import { Request, Response } from 'express';
import { Badge } from '@masochistme/sdk/dist/v1/types';
import { BadgesByGameIdListParams } from '@masochistme/sdk/dist/v1/api/games';

import { log } from 'helpers/log';
import { sortCollection } from 'helpers/db';
import { mongoInstance } from 'index';

/**
 * Returns a list of all badges belonging to a game with given ID.
 */
export const getBadgesByGameIdList = async (
  req: Request<any, any, BadgesByGameIdListParams>,
  res: Response,
): Promise<void> => {
  try {
    const { filter = {}, sort = {}, limit = 1000 } = req.body;
    const { isEnabled, isLegacy, ...restFilter } = filter;
    const { gameId } = req.params;

    const { db } = mongoInstance.getDb();
    const collection = db.collection<Badge>('badges');
    const badges: Badge[] = [];

    const cursor = collection
      .find({
        gameId: Number(gameId),
        ...restFilter,
        ...(isEnabled !== undefined && { isEnabled }),
        ...(isLegacy !== undefined && { isLegacy }),
      })
      .sort({
        ...(sort.points && { points: sortCollection(sort.points) }),
      })
      .limit(limit);

    await cursor.forEach((el: Badge) => {
      badges.push(el);
    });

    res.status(200).send(badges);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
