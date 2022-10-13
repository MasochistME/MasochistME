import { Request, Response } from 'express';
import { Season } from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { connectToDb } from 'helpers/db';

export const endActiveSeason = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { client, db } = await connectToDb();
    const collection = db.collection<Omit<Season, '_id'>>('seasons');
    const endDate = new Date();

    const response = await collection.updateMany(
      { endDate: null },
      {
        $set: { endDate },
      },
    );

    client.close();

    if (!response.acknowledged) {
      res.status(400).send({ error: 'Could not end this season.' });
    } else {
      res.status(200).send(response);
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
