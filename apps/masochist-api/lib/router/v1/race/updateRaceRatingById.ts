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
    const raceRating = req.body as RaceRating; 

    const { discordId, raceId, rating, difficulty } = raceRating;

    const oldRating = await collection.findOne({ discordId, raceId })
    const newRating = {
      ...oldRating,
      rating: rating ?? oldRating?.rating ?? null,
      difficulty: difficulty ?? oldRating?.difficulty ?? null,
    }

    const response = await collection.updateOne(
      { discordId, raceId },
      { $set: newRating },
      { upsert: true }
    );

    if (!response.acknowledged) {
      res.status(400).send({ error: 'Could not update the race rating.' });
    } else {
      res.status(200).send(newRating);
    }
  } catch (err: unknown) {
    log.ERROR(err);
    res.status(500).send({ error: err ?? 'Internal server error' });
  }
};



