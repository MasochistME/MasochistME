import { Race } from '@masochistme/sdk/dist/v1/types';
import { mongoInstance } from 'api';
import { Request, Response } from 'express';
import { log } from 'helpers/log';

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
  } catch (err: unknown) {
    log.ERROR(err);
    res.status(500).send({ error: err ?? 'Internal server error' });
  }
};
