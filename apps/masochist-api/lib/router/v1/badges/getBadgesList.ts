import { BadgesListParams } from '@masochistme/sdk/dist/v1/api/badges';
import { Badge } from '@masochistme/sdk/dist/v1/types';
import { mongoInstance } from 'api';
import { Request, Response } from 'express';
import { sortCollection } from 'helpers/db';
import { log } from 'helpers/log';

/**
 * Returns a list of all badges stored in the database.
 */
export const getBadgesList = async (
  req: Request<any, any, BadgesListParams>,
  res: Response,
): Promise<void> => {
  try {
    const { filter = {}, sort = {}, limit = 1000 } = req.body;

    const { db } = mongoInstance.getDb();
    const collection = db.collection<Badge>('badges');
    const badges: Badge[] = [];
    const fixedSort = {
      ...(sort.points && { points: sortCollection(sort.points) }),
    };

    const cursor = collection.find(filter).sort(fixedSort).limit(limit);

    await cursor.forEach((el: Badge) => {
      badges.push(el);
    });

    res.status(200).send(badges);
  } catch (err: unknown) {
    log.ERROR(err);
    res.status(500).send({ error: err ?? 'Internal server error' });
  }
};
