import { Tier } from '@masochistme/sdk/dist/v1/types';
import { mongoInstance } from 'api';
import { Request, Response } from 'express';
import { log } from 'helpers/log';

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
  } catch (err: unknown) {
    log.ERROR(err);
    res.status(500).send({ error: err ?? 'Internal server error' });
  }
};
