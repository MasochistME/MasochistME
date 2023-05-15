import { Request, Response } from 'express';
import { Log } from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { mongoInstance } from 'api';

/**
 * Creates a single log.
 */
export const createLog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const collection = db.collection<Omit<Log, '_id'>>('logs');
    const log = req.body; // TODO Add Request<Log> body validation

    const response = await collection.insertOne(log);

    if (!response.acknowledged) {
      res.status(400).send({ error: 'Could not create the log.' });
    } else {
      res.status(201).send(response);
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
