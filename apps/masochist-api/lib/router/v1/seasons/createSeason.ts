import { Season } from '@masochistme/sdk/dist/v1/types';
import { mongoInstance } from 'api';
import { Request, Response } from 'express';
import { log } from 'helpers/log';

export const createSeason = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const collection = db.collection<Omit<Season, '_id'>>('seasons');
    const season = req.body; // TODO Add Request<Season> body validation

    const response = await collection.insertOne({
      ...season,
      startDate: null,
      endDate: null,
    });

    if (!response.acknowledged) {
      res.status(400).send({ error: 'Could not create a new season.' });
    } else {
      res.status(201).send(response);
    }
  } catch (err: unknown) {
    log.ERROR(err);
    res.status(500).send({ error: err ?? 'Internal server error' });
  }
};
