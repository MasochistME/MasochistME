import { Request, Response } from 'express';
import { Patron } from '@masochistme/sdk/dist/v1/types';
import { PatronListParams } from '@masochistme/sdk/dist/v1/api/patrons';

import { log } from 'helpers/log';
import { sortCollection } from 'helpers/db';
import { mongoInstance } from 'api';

/**
 * Returns a list of all patrons stored in the database.
 */
export const getPatronsList = async (
  req: Request<any, any, PatronListParams>,
  res: Response,
): Promise<void> => {
  try {
    const { filter = {}, sort = {}, limit = 1000 } = req.body;

    const { db } = mongoInstance.getDb();
    const collection = db.collection<Patron>('patrons');
    const patrons: Omit<Patron, 'patronId'>[] = [];
    const fixedSort = {
      ...(sort.tier && { tier: sortCollection(sort.tier) }),
    };

    const cursor = collection.find(filter).sort(fixedSort).limit(limit);

    await cursor.forEach((el: Patron) => {
      const { patronId: _, ...rest } = el;
      patrons.push(rest);
    });

    res.status(200).send(patrons);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
