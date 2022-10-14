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
    const { finished = undefined, inactive = undefined } = req.body;
    const { client, db } = await connectToDb();
    const collection = db.collection<Season>('seasons');
    const cursor = collection.find({
      ...(inactive && { startDate: null }),
      ...(finished && { endDate: { $not: null } }),
    });
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
