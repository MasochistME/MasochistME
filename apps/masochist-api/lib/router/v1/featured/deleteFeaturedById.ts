import { Featured } from '@masochistme/sdk/dist/v1/types';
import { mongoInstance } from 'api';
import { Request, Response } from 'express';
import { log } from 'helpers/log';
import { ObjectId } from 'mongodb';

/**
 * Deletes a featured object with a given featured object ID.
 * @param req Request
 * @param res Response
 * @return void
 */
export const deleteFeaturedById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const collection = db.collection<Featured>('featured');
    const _id = new ObjectId(req.params.featuredId);

    const response = await collection.deleteOne({ _id });

    if (!response.acknowledged) {
      res.status(404).send({ error: 'Could not delete the featured object.' });
    } else {
      res.status(200).send(response);
    }
  } catch (err: unknown) {
    log.ERROR(err);
    res.status(500).send({ error: err ?? 'Internal server error' });
  }
};
