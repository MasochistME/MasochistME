import { Award } from '@masochistme/sdk/dist/v1/types';
import { mongoInstance } from 'api';
import { Request, Response } from 'express';
import { log } from 'helpers/log';

/**
 * Creates a new award.
 * @param req Request
 * @param res Response
 * @return void
 */
export const createAward = async (
  req: Request<any, any, Omit<Award, '_id'>>,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const collection = db.collection<Omit<Award, '_id'>>('awards');
    const award = req.body; // TODO Add Request<Award> body validation

    const responseAwardCreate = await collection.insertOne(award);

    if (!responseAwardCreate.insertedId) {
      res.status(400).send({ error: 'Could not create this award.' });
      return;
    }

    if (!responseAwardCreate.acknowledged) {
      res.status(400).send({ error: 'Could not create the award.' });
    } else {
      res.status(201).send(responseAwardCreate);
    }
  } catch (err: unknown) {
    log.ERROR(err);
    res.status(500).send({ error: err ?? 'Internal server error' });
  }
};
