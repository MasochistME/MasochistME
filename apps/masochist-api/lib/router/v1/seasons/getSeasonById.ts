import { Season } from '@masochistme/sdk/dist/v1/types';
import { mongoInstance } from 'api';
import { Request, Response } from 'express';
import { log } from 'helpers/log';
import { ObjectId } from 'mongodb';

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
  } catch (err: unknown) {
    log.ERROR(err);
    res.status(500).send({ error: err ?? 'Internal server error' });
  }
};
