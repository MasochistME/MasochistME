import { Request, Response } from 'express';
import { Season } from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { connectToDb } from 'helpers/db';

export const getActiveSeason = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { client, db } = await connectToDb();
    const collection = db.collection<Season>('seasons');
    const cursor = collection
      .find({
        endDate: null,
        //@ts-ignore:next-line
        startDate: { $not: null },
      })
      .sort({ startDate: 1 });
    const activeSeasons: Season[] = [];

    await cursor.forEach((el: Season) => {
      activeSeasons.push(el);
    });

    client.close();

    res.status(200).send(activeSeasons);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
