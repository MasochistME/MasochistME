import { Request, Response } from 'express';
import {
  Badge,
  Event,
  EventType,
  EventBadgeCreate,
} from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { connectToDb } from 'helpers/db';

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
    const { client, db } = await connectToDb();
    const collectionEvents = db.collection<Omit<Event, '_id'>>('events');
    const collection = db.collection<Omit<Badge, '_id'>>('badges');
    const badge = req.body; // TODO Add Request<Badge> body validation

    const responseBadgeCreate = await collection.insertOne(badge);

    if (!responseBadgeCreate.insertedId) {
      res.status(400).send({ error: 'Could not create this badge.' });
      return;
    }
    /**
     * Create a "badge created" event
     */
    const badgeCreateEvent: Omit<EventBadgeCreate, '_id'> = {
      type: EventType.BADGE_CREATE,
      date: new Date(),
      badgeId: String(responseBadgeCreate.insertedId),
      gameId: badge.gameId ?? badge.title ?? 'UNKNOWN',
    };
    const responseBadgeGrantEvent = await collectionEvents.insertOne(
      badgeCreateEvent,
    );

    client.close();

    if (
      !responseBadgeCreate.acknowledged ||
      !responseBadgeGrantEvent.acknowledged
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
