import { Request, Response } from 'express';
import { Season } from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { connectToDb } from 'helpers/db';

/**
 * Returns a list of all seasons.
 * @param params.finished - Get only seasons which are finished.
 * @param params.inactive - Get only seasons which are yet to start.
 */
export const getSeasonsList = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { active, inactive, finished, unfinished } = req.body.filter ?? {};
    const { client, db } = await connectToDb();
    const collection = db.collection<Season>('seasons');
    const cursor = collection
      .find({
        ...(inactive && { startDate: null, endDate: null }), //  has NO start date and NO end date
        ...(active && { startDate: { $ne: null }, endDate: null }), // has start date AND no end date
        ...(finished && { endDate: { $ne: null } }), // has start date AND end date
        ...(unfinished && { endDate: null }), // has no end date
      })
      .sort({ startDate: 1 });
    const seasons: Season[] = [];

    await cursor.forEach((el: Season) => {
      if (finished && !el.endDate) return;
      if (inactive && el.startDate) return;
      seasons.push(el);
    });

    client.close();

    res.status(200).send(seasons);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
