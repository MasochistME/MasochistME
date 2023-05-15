import { Request, Response } from 'express';
import { Season } from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { mongoInstance } from 'api';

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
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
