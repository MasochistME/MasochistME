import { PatreonTier } from '@masochistme/sdk/dist/v1/types';
import { mongoInstance } from 'api';
import { Request, Response } from 'express';
import { log } from 'helpers/log';

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
  } catch (err: unknown) {
    log.ERROR(err);
    res.status(500).send({ error: err ?? 'Internal server error' });
  }
};
