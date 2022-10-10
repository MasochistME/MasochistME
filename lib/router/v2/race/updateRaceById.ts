import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { Race } from '@masochistme/sdk/dist/v2/types';

import { log } from 'helpers/log';
import { connectToDb } from 'helpers/db';

export const updateRaceById = async (
  req: Request<any, Partial<Omit<Race, '_id'>>>,
  res: Response,
): Promise<void> => {
  try {
    const { client, db } = await connectToDb();
    const collection = db.collection<Race>('races');
    const _id = new ObjectId(req.params.id);
    const {
      name,
      instructions,
      startTime,
      endTime,
      downloadLink,
      downloadGrace,
      uploadGrace,
      icon,
    } = req.body; // TODO add validation

    const response = await collection.updateOne(
      { _id },
      {
        $set: {
          ...(name && { name }),
          ...(instructions && { instructions }),
          ...(startTime && { startTime }),
          ...(endTime && { endTime }),
          ...(downloadLink && { downloadLink }),
          ...(downloadGrace && { downloadGrace }),
          ...(uploadGrace && { uploadGrace }),
          ...(icon && { icon }),
        },
      },
    );

    client.close();

    if (!response.acknowledged) {
      res.status(400).send({ error: 'Could not update the race.' });
    } else {
      res.status(200).send(response);
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
