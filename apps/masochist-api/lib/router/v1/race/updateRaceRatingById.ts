import { Request, Response } from 'express';
import { RaceRating } from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { mongoInstance } from 'api';

export const updateRaceRatingById = async (
  req: Request<any, RaceRating>,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const collection = db.collection<RaceRating>('raceRatings');
    const raceRating = req.body; 

    const {discordId, raceId} = raceRating;

    const response = await collection.updateOne(
      { discordId, raceId },
      { $set: raceRating },
      { upsert:true }
    );

    if (!response.acknowledged) {
      res.status(400).send({ error: 'Could not update the race rating.' });
    } else {
      res.status(200).send(response);
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};



