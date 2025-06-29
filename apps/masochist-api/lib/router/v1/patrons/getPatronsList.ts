import { PatronListParams } from '@masochistme/sdk/dist/v1/api/patrons';
import { Patron } from '@masochistme/sdk/dist/v1/types';
import { mongoInstance } from 'api';
import { Request, Response } from 'express';
import { sortCollection } from 'helpers/db';
import { log } from 'helpers/log';

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
  } catch (err: unknown) {
    log.ERROR(err);
    res.status(500).send({ error: err ?? 'Internal server error' });
  }
};
