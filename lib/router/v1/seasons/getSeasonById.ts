import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { Season } from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { mongoInstance } from 'index';

export const getSeasonById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const collection = db.collection<Season>('seasons');
    const _id = new ObjectId(req.params.seasonId);

    const season: Season | null = await collection.findOne({ _id });

    if (!season) {
      res
        .status(404)
        .send({ error: 'Could not find the season with this id.' });
    } else {
      res.status(200).send(season);
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
