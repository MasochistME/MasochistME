import { Request, Response } from 'express';
import { Race } from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { mongoInstance } from 'index';

export const getActiveRace = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const collection = db.collection<Race>('races');
    const cursor = collection
      .find({ endDate: { $gte: new Date() } })
      .sort({ startDate: 1 });
    const futureRaces: Race[] = [];

    await cursor.forEach((el: Race) => {
      futureRaces.push(el);
    });

    res.status(200).send(futureRaces);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
