import { Request, Response } from 'express';
import { Race } from '@masochistme/sdk/dist/v2/types';

import { log } from 'helpers/log';
import { connectToDb } from 'helpers/db';

export const getActiveRace = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { client, db } = await connectToDb();
    const collection = db.collection<Race>('races');
    const cursor = collection
      .find({ endTime: { $gt: new Date() } })
      .sort({ startTime: 1 });
    const futureRaces: Race[] = [];

    await cursor.forEach((el: Race) => {
      futureRaces.push(el);
    });

    client.close();

    res.status(200).send(futureRaces);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
