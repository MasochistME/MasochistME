import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { Race } from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { connectToDb } from 'helpers/db';

export const updateRaceById = async (
  req: Request<any, Partial<Omit<Race, '_id'>>>,
  res: Response,
): Promise<void> => {
  try {
    const { client, db } = await connectToDb();
    const collection = db.collection<Race>('races');
    const _id = new ObjectId(req.params.raceId);
    const {
      name,
      instructions,
      objectives,
      startTime,
      endTime,
      downloadLink,
      downloadGrace,
      uploadGrace,
      icon,
      isActive,
    } = req.body; // TODO add validation

    const response = await collection.updateOne(
      { _id },
      {
        $set: {
          ...(name && { name }),
          ...(instructions && { instructions }),
          ...(objectives && { objectives }),
          ...(startTime && { startTime: new Date(startTime) }),
          ...(endTime && { endTime: new Date(endTime) }),
          ...(downloadLink && { downloadLink }),
          ...(downloadGrace && { downloadGrace: Number(downloadGrace) }),
          ...(uploadGrace && { uploadGrace: Number(uploadGrace) }),
          ...(icon && { icon }),
          ...(isActive !== undefined && { isActive: Boolean(isActive) }),
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
