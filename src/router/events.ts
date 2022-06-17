import { Request, Response } from 'express';
import { orderBy } from 'lodash';
import { getDataFromDB } from 'helpers/db';

/**
 * Get all events.
 */
export const getEvents = async (req: Request, res: Response): Promise<void> => {
  const events = await getDataFromDB('events');
  const limit = Number(req.params?.limit ?? 100);

  if (events) {
    const sortedEvents = orderBy(events, ['date'], ['desc']);
    const eventsWithLimit = limit ? sortedEvents.slice(0, limit) : sortedEvents;
    // TODO oldTier, newTier, game, member need to have type Number (they are String now)
    // game => rename to gameId
    // member => rename to memberId

    res.status(200).send(eventsWithLimit);
  } else {
    res.sendStatus(404);
  }
};
