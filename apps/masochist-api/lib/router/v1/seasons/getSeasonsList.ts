import { SeasonsListParams } from '@masochistme/sdk/dist/v1/api/seasons';
import { Season } from '@masochistme/sdk/dist/v1/types';
import { mongoInstance } from 'api';
import { Request, Response } from 'express';
import { sortCollection } from 'helpers/db';
import { log } from 'helpers/log';

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
        isVisible: true,
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
  } catch (err: unknown) {
    log.ERROR(err);
    res.status(500).send({ error: err ?? 'Internal server error' });
  }
};
