import { Request, Response } from 'express';
import { PatreonTier } from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { mongoInstance } from 'api';

/**
 * Returns a list of patreon tiers.
 */
export const getPatreonTierList = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const collection = db.collection<PatreonTier>('patreonTiers');
    const patreonTiers: PatreonTier[] = [];

    const cursor = collection.find();

    await cursor.forEach((el: PatreonTier) => {
      patreonTiers.push(el);
    });

    res.status(200).send(patreonTiers);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
