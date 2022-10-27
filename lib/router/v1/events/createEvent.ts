import { Request, Response } from 'express';
import { Event } from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { mongoInstance } from 'index';

/**
 * Creates a single event.
 */
export const createEvent = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const collection = db.collection<Omit<Event, '_id'>>('events');
    const event = req.body; // TODO Add Request<Event> body validation

    const response = await collection.insertOne(event);

    if (!response.acknowledged) {
      res.status(400).send({ error: 'Could not create the event.' });
    } else {
      res.status(201).send(response);
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
