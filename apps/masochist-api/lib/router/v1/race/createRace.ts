import { Race } from '@masochistme/sdk/dist/v1/types';
import { mongoInstance } from 'api';
import { Request, Response } from 'express';
import { log } from 'helpers/log';

export const createRace = async (
  req: Request<any, Race>,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const collection = db.collection<Omit<Race, '_id'>>('races');
    const race = req.body; // TODO Add Request<Race> body validation

    const fixedRace: Omit<Race, '_id'> = {
      ...race,
      startDate: new Date(race.startDate),
      endDate: new Date(race.endDate),
      isActive: false,
      isDone: false,
    };

    const response = await collection.insertOne(fixedRace);

    if (!response.acknowledged) {
      res.status(400).send({ error: 'Could not create the race.' });
    } else {
      res.status(201).send(response);
    }
  } catch (err: unknown) {
    log.ERROR(err);
    res.status(500).send({ error: err ?? 'Internal server error' });
  }
};
