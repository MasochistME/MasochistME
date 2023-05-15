import { Request, Response } from 'express';
import { Season } from '@masochistme/sdk/dist/v1/types';
import { SeasonsListParams } from '@masochistme/sdk/dist/v1/api/seasons';

import { log } from 'helpers/log';
import { mongoInstance } from 'api';
import { sortCollection } from 'helpers/db';

/**
 * Returns a list of all seasons.
 */
export const getSeasonsList = async (
  req: Request<any, any, SeasonsListParams>,
  res: Response,
): Promise<void> => {
  try {
    const { filter = {}, sort = {}, limit = 1000 } = req.body;
    const { active, inactive, finished, unfinished } = filter;

    const { db } = mongoInstance.getDb();
    const collection = db.collection<Season>('seasons');
    const seasons: Season[] = [];

    const cursor = collection
      .find({
        ...(inactive !== undefined && { startDate: null, endDate: null }), //  has NO start date and NO end date
        ...(active !== undefined && {
          startDate: { $ne: null },
          endDate: null,
        }), // has start date AND no end date
        ...(finished !== undefined && { endDate: { $ne: null } }), // has start date AND end date
        ...(unfinished !== undefined && { endDate: null }), // has no end date
      })
      .sort({
        ...(sort.startDate && { startDate: sortCollection(sort.startDate) }),
        ...(sort.endDate && { endDate: sortCollection(sort.endDate) }),
      })
      .limit(limit);

    await cursor.forEach((el: Season) => {
      if (finished && !el.endDate) return;
      if (inactive && el.startDate) return;
      seasons.push(el);
    });

    res.status(200).send(seasons);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
