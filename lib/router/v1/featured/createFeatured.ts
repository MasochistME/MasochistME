import { Request, Response } from 'express';
import { Featured } from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { mongoInstance } from 'index';

/**
 * Creates a new featured object.
 * @param req Request
 * @param res Response
 * @return void
 */
export const createFeatured = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const collection = db.collection<Omit<Featured, '_id'>>('featured');
    const featured: Omit<
      Featured,
      '_id' | 'date' | 'isApproved' | 'isVisible' | 'isSticky'
    > = req.body; // TODO Add Request<Featured> body validation

    const response = await collection.insertOne({
      date: new Date(),
      isApproved: false,
      isVisible: false,
      isSticky: false,
      ...featured,
    });

    if (!response.acknowledged) {
      res
        .status(400)
        .send({ error: 'Could not create a new featured object.' });
    } else {
      res.status(201).send(response);
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
