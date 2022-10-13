import { Request, Response } from 'express';
import { Season } from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { connectToDb } from 'helpers/db';
import { ObjectId } from 'mongodb';

export const startSeasonById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { client, db } = await connectToDb();
    const collection = db.collection<Omit<Season, '_id'>>('seasons');
    const _id = new ObjectId(req.params.seasonId);
    const startDate = new Date();

    const response = await collection.updateOne(
      { _id },
      {
        $set: { startDate },
      },
    );

    client.close();

    if (!response.acknowledged) {
      res.status(400).send({ error: 'Could not start this season.' });
    } else {
      res.status(201).send(response);
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
