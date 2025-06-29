import { Badge } from '@masochistme/sdk/dist/v1/types';
import { mongoInstance } from 'api';
import { Request, Response } from 'express';
import { log } from 'helpers/log';
import { ObjectId } from 'mongodb';

/**
 * Updates a badge with given badge ID. All of the updatable fields are optional.
 * @param req Request
 * @param res Response
 * @return void
 */
export const updateBadgeById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const collection = db.collection<Badge>('badges');
    const _id = new ObjectId(req.params.badgeId);
    const { name, description, points, requirements, img } =
      req.body as Partial<Badge>; // TODO Add Request<Badge> body validation

    const response = await collection.updateOne(
      { _id },
      {
        $set: {
          ...(name && { name }),
          ...(description && { description }),
          ...(points && { points }),
          ...(requirements && { requirements }),
          ...(img && { img }),
        },
      },
    );

    if (!response.acknowledged) {
      res.status(400).send({ error: 'Could not update the badge.' });
    } else {
      res.status(200).send(response);
    }
  } catch (err: unknown) {
    log.ERROR(err);
    res.status(500).send({ error: err ?? 'Internal server error' });
  }
};
