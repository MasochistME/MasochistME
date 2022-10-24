import { Request, Response } from 'express';
import { Featured } from '@masochistme/sdk/dist/v1/types';
import { FeaturedListParams } from '@masochistme/sdk/dist/v1/api/featured';

import { log } from 'helpers/log';
import { connectToDb, sortCollection } from 'helpers/db';

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

    const { client, db } = await connectToDb();
    const collection = db.collection<Featured>('featured');
    const featured: Featured[] = [];

    const cursor = collection
      .find({
        ...(from !== undefined && { date: { $gte: new Date(from) } }),
        ...(to !== undefined && { date: { $lte: new Date(to) } }),
        ...restFilter,
      })
      .sort({
        ...(sort.date && { date: sortCollection(sort.date) }),
      })
      .limit(limit);

    await cursor.forEach((el: Featured) => {
      featured.push(el);
    });

    client.close();

    res.status(200).send(featured);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
