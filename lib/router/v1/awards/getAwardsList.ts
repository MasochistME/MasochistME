import { Request, Response } from 'express';
import { Award } from '@masochistme/sdk/dist/v1/types';
import { AwardsListParams } from '@masochistme/sdk/dist/v1/api/awards';

import { log } from 'helpers/log';
import { mongoInstance } from 'index';

/**
 * Returns a list of all awards stored in the database.
 */
export const getAwardsList = async (
  req: Request<any, any, AwardsListParams>,
  res: Response,
): Promise<void> => {
  try {
    const { filter = {}, sort = {}, limit = 1000 } = req.body;

    const { db } = mongoInstance.getDb();
    const collection = db.collection<Award>('awards');
    const awards: Award[] = [];

    const cursor = collection
      .find(filter)
      // .sort(sort) // This is unused atm
      .limit(limit);

    await cursor.forEach((el: Award) => {
      awards.push(el);
    });

    res.status(200).send(awards);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
