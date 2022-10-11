import { Request, Response } from 'express';
import { Badge } from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { connectToDb } from 'helpers/db';

export const createBadge = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { client, db } = await connectToDb();
    const collection = db.collection<Omit<Badge, '_id'>>('badges');
    const badge = req.body; // TODO add validation

    const response = await collection.insertOne(badge);

    client.close();

    if (!response.acknowledged) {
      res.status(400).send({ error: 'Could not create the badge.' });
    } else {
      res.status(201).send(response);
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
