import { Request, Response } from 'express';
import { Patron } from '@masochistme/sdk/dist/v1/types';
import { PatronListParams } from '@masochistme/sdk/dist/v1/api/patrons';

import { log } from 'helpers/log';
import { connectToDb, sortCollection } from 'helpers/db';

/**
 * Returns a list of all patrons stored in the database.
 */
export const getPatronsList = async (
  req: Request<any, any, PatronListParams>,
  res: Response,
): Promise<void> => {
  try {
    const { filter = {}, sort = {}, limit = 1000 } = req.body;

    const { client, db } = await connectToDb();
    const collection = db.collection<Patron>('patrons');
    const patrons: Patron[] = [];
    const fixedSort = {
      ...(sort.tier && { tier: sortCollection(sort.tier) }),
    };

    const cursor = collection.find(filter).sort(fixedSort).limit(limit);

    await cursor.forEach((el: Patron) => {
      patrons.push(el);
    });

    client.close();

    res.status(200).send(patrons);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
