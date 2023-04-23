import { Request, Response } from 'express';
import { Featured } from '@masochistme/sdk/dist/v1/types';
import { FeaturedListParams } from '@masochistme/sdk/dist/v1/api/featured';

import { log } from 'helpers/log';
import { sortCollection } from 'helpers/db';
import { mongoInstance } from 'index';

/**
 * Returns a list of all featured objects stored in the database.
 */
export const getFeaturedList = async (
  req: Request<any, any, FeaturedListParams>,
  res: Response,
): Promise<void> => {
  try {
    const { filter = {}, sort = {}, limit = 1000 } = req.body;
    const { from, to, ...restFilter } = filter;

    const { db } = mongoInstance.getDb();
    const collection = db.collection<Featured>('featured');
    const featured: Featured[] = [];

    const cursor = collection
      .find({
        ...(from !== undefined && {
          $or: [{ date: { $gte: new Date(from) } }, { isSticky: true }],
        }),
        ...(to !== undefined && {
          $or: [{ date: { $lte: new Date(to) } }, { isSticky: true }],
        }),
        ...restFilter,
      })
      .sort({
        ...(sort.date && { date: sortCollection(sort.date) }),
      })
      .limit(limit);

    await cursor.forEach((el: Featured) => {
      featured.push(el);
    });

    res.status(200).send(featured);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
