import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { Badge } from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { connectToDb } from 'helpers/db';

export const deleteBadgeById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { client, db } = await connectToDb();
    const collection = db.collection<Badge>('badges');
    const _id = new ObjectId(req.params.id);

    const response = await collection.deleteOne({ _id });

    client.close();

    if (!response.acknowledged) {
      res.status(404).send({ error: 'Could not delete the badge.' });
    } else {
      res.status(200).send(response);
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
