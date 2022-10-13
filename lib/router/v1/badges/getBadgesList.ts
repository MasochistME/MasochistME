import { Request, Response } from 'express';
import { Badge } from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { connectToDb } from 'helpers/db';

/**
 * Returns a list of all badges stored in the database.
 * @param _req Request
 * @param res Response
 * @return void
 */
export const getBadgesList = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { client, db } = await connectToDb();
    const collection = db.collection<Badge>('badges');
    const cursor = collection.find();
    const badges: Badge[] = [];

    await cursor.forEach((el: Badge) => {
      badges.push(el);
    });

    client.close();

    res.status(200).send(badges);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
