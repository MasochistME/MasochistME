import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { Race } from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { mongoInstance } from 'api';

export const deleteRaceById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const collection = db.collection<Race>('races');
    const _id = new ObjectId(req.params.raceId);

    const response = await collection.deleteOne({ _id });

    if (!response.acknowledged) {
      res.status(404).send({ error: 'Could not delete the race.' });
    } else {
      res.status(200).send(response);
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
