import { Patron } from '@masochistme/sdk/dist/v1/types';
import { mongoInstance } from 'api';
import { Request, Response } from 'express';
import { log } from 'helpers/log';

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
  } catch (err: unknown) {
    log.ERROR(err);
    res.status(500).send({ error: err ?? 'Internal server error' });
  }
};
