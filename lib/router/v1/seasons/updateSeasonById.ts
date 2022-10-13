import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { Season } from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { connectToDb } from 'helpers/db';

/**
 * Updates a season by its ID. All of the updatable fields are optional.
 * @param req Request
 * @param res Response
 * @return void
 */
export const updateSeasonById = async (
  req: Request<
    { seasonId: string },
    any,
    Pick<Season, 'name' | 'description' | 'icon'>
  >,
  res: Response,
): Promise<void> => {
  try {
    const { client, db } = await connectToDb();
    const collection = db.collection<Season>('seasons');
    const _id = new ObjectId(req.params.seasonId);
    const { name, description, icon } = req.body; // TODO add validation

    const response = await collection.updateOne(
      { _id },
      {
        $set: {
          ...(name && { name }),
          ...(description && { description }),
          ...(icon && { icon }),
        },
      },
    );

    client.close();

    if (!response.acknowledged) {
      res.status(400).send({ error: 'Could not update the season.' });
    } else {
      res.status(200).send(response);
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
