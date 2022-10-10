import { Request, Response } from 'express';
import { Race } from '@masochistme/sdk/dist/v2/types';

import { log } from 'helpers/log';
import { connectToDb } from 'helpers/db';

/**
 * Returns a list of all races stored in the database.
 * @param _req Request
 * @param res Response
 */
export const getRaceList = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { client, db } = await connectToDb();
    const collection = db.collection<Race>('races');
    const cursor = collection.find();
    const races: Race[] = [];

    await cursor.forEach((el: Race) => {
      races.push(el);
    });

    client.close();

    res.status(200).send(races);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
