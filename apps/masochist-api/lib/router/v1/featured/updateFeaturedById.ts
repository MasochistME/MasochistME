import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { Featured } from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { mongoInstance } from 'api';

/**
 * Updates a featured object with given feature object ID. All of the updatable fields are optional.
 * @param req Request
 * @param res Response
 * @return void
 */
export const updateFeaturedById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const collection = db.collection<Featured>('featured');
    const _id = new ObjectId(req.params.featuredId);
    const { date, ...featuredUpdate }: Featured = req.body; // TODO Add Request<Featured> body validation

    const response = await collection.updateOne(
      { _id },
      {
        $set: {
          ...(date && { date: new Date(date) }),
          ...featuredUpdate,
        },
      },
    );

    if (!response.acknowledged) {
      res.status(400).send({ error: 'Could not update the featured object.' });
    } else {
      res.status(200).send(response);
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
