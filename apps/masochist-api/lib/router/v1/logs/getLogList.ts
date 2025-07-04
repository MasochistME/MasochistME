import { LogListParams } from '@masochistme/sdk/dist/v1/api/logs';
import { Log } from '@masochistme/sdk/dist/v1/types';
import { mongoInstance } from 'api';
import { Request, Response } from 'express';
import { sortCollection } from 'helpers/db';
import { log } from 'helpers/log';

/**
 * Returns a list of all logs.
 */
export const getLogList = async (
  req: Request<any, any, LogListParams>,
  res: Response,
): Promise<void> => {
  try {
    const { filter = {}, sort = {}, limit = 1000 } = req.body;

    const { db } = mongoInstance.getDb();
    const collection = db.collection<Log>('logs');
    const logs: Log[] = [];

    const cursor = collection
      .find(filter)
      .sort({ ...(sort.date && { date: sortCollection(sort.date) }) })
      .limit(limit);

    await cursor.forEach((el: Log) => {
      logs.push(el);
    });

    res.status(200).send(logs);
  } catch (err: unknown) {
    log.ERROR(err);
    res.status(500).send({ error: err ?? 'Internal server error' });
  }
};
