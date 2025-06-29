import { Race } from '@masochistme/sdk/dist/v1/types';
import { mongoInstance } from 'api';
import { Request, Response } from 'express';
import { log } from 'helpers/log';
import { ObjectId } from 'mongodb';

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
  } catch (err: unknown) {
    log.ERROR(err);
    res.status(500).send({ error: err ?? 'Internal server error' });
  }
};
