import { Log } from '@masochistme/sdk/dist/v1/types';
import { mongoInstance } from 'api';
import { Request, Response } from 'express';
import { log } from 'helpers/log';

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
  } catch (err: unknown) {
    log.ERROR(err);
    res.status(500).send({ error: err ?? 'Internal server error' });
  }
};
