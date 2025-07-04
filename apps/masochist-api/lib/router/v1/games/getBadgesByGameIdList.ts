import { BadgesByGameIdListParams } from '@masochistme/sdk/dist/v1/api/games';
import { Badge } from '@masochistme/sdk/dist/v1/types';
import { mongoInstance } from 'api';
import { Request, Response } from 'express';
import { sortCollection } from 'helpers/db';
import { log } from 'helpers/log';

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
  } catch (err: unknown) {
    log.ERROR(err);
    res.status(500).send({ error: err ?? 'Internal server error' });
  }
};
