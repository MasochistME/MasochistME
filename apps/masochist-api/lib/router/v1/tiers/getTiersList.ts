import { Request, Response } from 'express';
import { Tier } from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { mongoInstance } from 'api';

/**
 * Returns a list of tiers.
 * @param _req Request
 * @param res Response
 */
export const getTiersList = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const collection = db.collection<Tier>('tiers');
    const cursor = collection.find().sort({ score: 1 });
    const tiers: Tier[] = [];

    await cursor.forEach((el: Tier) => {
      tiers.push(el);
    });

    res.status(200).send(tiers);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
