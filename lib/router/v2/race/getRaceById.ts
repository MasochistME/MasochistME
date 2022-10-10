import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { Race } from '@masochistme/sdk/dist/v2/types';

import { log } from 'helpers/log';
import { connectToDb } from 'helpers/db';

export const getRaceById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { client, db } = await connectToDb();
    const collection = db.collection<Race>('races');
    const _id = new ObjectId(req.params.id);

    const race: Race | null = await collection.findOne({ _id });

    client.close();

    if (!race) {
      res.status(404).send({ error: 'Could not find the race with this id.' });
    } else {
      res.status(200).send(race);
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
