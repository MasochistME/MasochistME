import { Patron } from '@masochistme/sdk/dist/v1/types';
import { mongoInstance } from 'api';
import { Request, Response } from 'express';
import { log } from 'helpers/log';
import { ObjectId } from 'mongodb';

/**
 * Updates a patron with given patron ID. All of the updatable fields are optional.
 * @param req Request
 * @param res Response
 * @return void
 */
export const updatePatronById = async (
  req: Request<any, any, Omit<Patron, '_id'>>,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const collection = db.collection<Patron>('patrons');
    const _id = new ObjectId(req.params.badgeId);
    const { tier, username, avatar } = req.body; // TODO Add Request<Patron> body validation

    const response = await collection.updateOne(
      { _id },
      {
        $set: {
          ...(tier && { tier }),
          ...(username && { username }),
          ...(avatar && { avatar }),
        },
      },
    );

    if (!response.acknowledged) {
      res.status(400).send({ error: 'Could not update the patron.' });
    } else {
      res.status(200).send(response);
    }
  } catch (err: unknown) {
    log.ERROR(err);
    res.status(500).send({ error: err ?? 'Internal server error' });
  }
};
