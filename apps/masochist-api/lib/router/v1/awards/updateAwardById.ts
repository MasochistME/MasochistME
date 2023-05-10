import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { Award } from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { mongoInstance } from 'api';

/**
 * Updates an award with given award ID. All of the updatable fields are optional.
 * @param req Request
 * @param res Response
 * @return void
 */
export const updateAwardById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const collection = db.collection<Award>('awards');
    const _id = new ObjectId(req.params.awardId);
    const {
      name,
      description,
      img,
      category,
      isStackable,
      isEnabled,
      isLegacy,
    } = req.body as Partial<Award>; // TODO Add Request<Award> body validation

    const response = await collection.updateOne(
      { _id },
      {
        $set: {
          ...(name && { name }),
          ...(description && { description }),
          ...(img && { img }),
          ...(category && { category }),
          ...(isStackable !== undefined && { isStackable }),
          ...(isEnabled !== undefined && { isEnabled }),
          ...(isLegacy !== undefined && { isLegacy }),
        },
      },
    );

    if (!response.acknowledged) {
      res.status(400).send({ error: 'Could not update the award.' });
    } else {
      res.status(200).send(response);
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
