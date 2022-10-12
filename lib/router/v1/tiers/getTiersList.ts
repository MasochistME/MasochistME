import { Request, Response } from 'express';
import { Tier } from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { connectToDb } from 'helpers/db';

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
    const { client, db } = await connectToDb();
    const collection = db.collection<Tier>('tiers');
    const cursor = collection.find();
    const tiers: Tier[] = [];

    await cursor.forEach((el: Tier) => {
      tiers.push(el);
    });

    client.close();

    res.status(200).send(tiers);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
