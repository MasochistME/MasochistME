import { Featured } from '@masochistme/sdk/dist/v1/types';
import { mongoInstance } from 'api';
import { Request, Response } from 'express';
import { log } from 'helpers/log';
import { ObjectId } from 'mongodb';

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
  } catch (err: unknown) {
    log.ERROR(err);
    res.status(500).send({ error: err ?? 'Internal server error' });
  }
};
