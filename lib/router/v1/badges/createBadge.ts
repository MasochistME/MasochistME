import { Request, Response } from 'express';
import {
  Badge,
  Log,
  LogType,
  LogBadgeCreate,
} from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { mongoInstance } from 'index';

/**
 * Creates a new badge.
 * @param req Request
 * @param res Response
 * @return void
 */
export const createBadge = async (
  req: Request<any, any, Omit<Badge, '_id'>>,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const collectionLogs = db.collection<Omit<Log, '_id'>>('logs');
    const collection = db.collection<Omit<Badge, '_id'>>('badges');
    const badge = req.body; // TODO Add Request<Badge> body validation

    const responseBadgeCreate = await collection.insertOne(badge);

    if (!responseBadgeCreate.insertedId) {
      res.status(400).send({ error: 'Could not create this badge.' });
      return;
    }
    /**
     * Create a "badge created" log
     */
    const badgeCreateLog: Omit<LogBadgeCreate, '_id'> = {
      type: LogType.BADGE_CREATE,
      date: new Date(),
      badgeId: String(responseBadgeCreate.insertedId),
      gameId: badge.gameId ?? badge.title ?? 'UNKNOWN',
    };
    const responseBadgeGrantLog = await collectionLogs.insertOne(
      badgeCreateLog,
    );

    if (
      !responseBadgeCreate.acknowledged ||
      !responseBadgeGrantLog.acknowledged
    ) {
      res.status(400).send({ error: 'Could not create the badge.' });
    } else {
      res.status(201).send(responseBadgeCreate);
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
