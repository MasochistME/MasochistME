import { Request, Response } from 'express';
import { Event } from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { connectToDb } from 'helpers/db';

/**
 * Returns a list of all events.
 *
 * ### Filter options
 *
 * - `type` - return only events of a specific type,
 * - `memberId` - return only events related to a specific member.
 *
 * @param params.filter - Filter to apply to returned events list.
 * @param params.filter.type - Get events of only particular type.
 * @param params.filter.memberId - Get events related to a specific member.
 * @param params.limit - Limit how many events you want to have returned (sorted from newest).
 */
export const getEventsList = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { type, memberId } = req.body.filter ?? {};
    const limit = req.body.limit;

    const { client, db } = await connectToDb();
    const collection = db.collection<Event>('events');
    const cursor = collection
      .find({
        ...(memberId && { memberId }),
        ...(type && { type }),
      })
      .sort({ date: 1 });
    const events: Event[] = [];

    await cursor.forEach((el: Event) => {
      events.push(el);
    });

    if (limit) events.slice(limit - 1);

    client.close();

    res.status(200).send(events);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
