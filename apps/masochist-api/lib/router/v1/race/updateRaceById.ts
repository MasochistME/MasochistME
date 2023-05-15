import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { Race } from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { mongoInstance } from 'api';

export const updateRaceById = async (
  req: Request<any, Partial<Omit<Race, '_id'>>>,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const collection = db.collection<Race>('races');
    const _id = new ObjectId(req.params.raceId);
    const {
      name,
      instructions,
      objectives,
      startDate,
      endDate,
      downloadLink,
      downloadGrace,
      uploadGrace,
      icon,
      isActive,
      isDone,
    } = req.body; // TODO Add Request<Race> body validation

    const response = await collection.updateOne(
      { _id },
      {
        $set: {
          ...(name && { name }),
          ...(instructions && { instructions }),
          ...(objectives && { objectives }),
          ...(startDate && { startDate: new Date(startDate) }),
          ...(endDate && { endDate: new Date(endDate) }),
          ...(downloadLink && { downloadLink }),
          ...(downloadGrace && { downloadGrace: Number(downloadGrace) }),
          ...(uploadGrace && { uploadGrace: Number(uploadGrace) }),
          ...(icon && { icon }),
          ...(isActive !== undefined && { isActive: Boolean(isActive) }),
          ...(isDone !== undefined && { isDone: Boolean(isDone) }),
        },
      },
    );

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
