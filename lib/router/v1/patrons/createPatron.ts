import { Request, Response } from 'express';
import { Patron } from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { mongoInstance } from 'index';

/**
 * Creates a new patron.
 * @param req Request
 * @param res Response
 * @return void
 */
export const createPatron = async (
  req: Request<any, any, Omit<Patron, '_id'>>,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const collection = db.collection<Omit<Patron, '_id'>>('patrons');
    const patron: Omit<Patron, '_id'> = req.body; // TODO Add Request<Patron> body validation

    const response = await collection.insertOne(patron);

    if (!response.acknowledged) {
      res.status(400).send({ error: 'Could not create a new patron.' });
    } else {
      res.status(201).send(response);
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
