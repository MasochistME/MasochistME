import { Request, Response } from 'express';
import { Race } from '@masochistme/sdk/dist/v1/types';
import { RaceListParams } from '@masochistme/sdk/dist/v1/api/races';

import { log } from 'helpers/log';
import { mongoInstance } from 'index';
import { sortCollection } from 'helpers/db';

/**
 * Returns a list of all races stored in the database.
 */
export const getRaceList = async (
  req: Request<any, any, RaceListParams>,
  res: Response,
): Promise<void> => {
  try {
    const { filter = {}, sort = {}, limit = 1000 } = req.body;

    const { db } = mongoInstance.getDb();
    const collection = db.collection<Race>('races');
    const races: Race[] = [];

    const cursor = collection
      .find(filter)
      .sort({
        ...(sort.season && { season: sortCollection(sort.season) }),
        ...(sort.startDate && { startDate: sortCollection(sort.startDate) }),
        ...(sort.endDate && { endDate: sortCollection(sort.endDate) }),
      })
      .limit(limit);

    await cursor.forEach((el: Race) => {
      races.push(el);
    });

    res.status(200).send(races);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
