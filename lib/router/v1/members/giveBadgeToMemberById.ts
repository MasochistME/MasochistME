import { Request, Response } from 'express';
import {
  Event,
  EventBadgeGet,
  EventType,
  MemberBadge,
} from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { connectToDb } from 'helpers/db';

/**
 * Gives a badge with given badge ID to member with given member ID.
 * @param req Request
 * @param res Response
 * @return void
 */
export const giveBadgeToMemberById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { client, db } = await connectToDb();
    const collectionEvents = db.collection<Omit<Event, '_id'>>('events');
    const collectionMemberBadges =
      db.collection<Omit<MemberBadge, '_id'>>('memberBadges');
    const { badgeId, memberId } = req.params;

    /**
     * Give member a badge
     */
    const memberBadge: MemberBadge | null =
      await collectionMemberBadges.findOne({
        badgeId,
        memberId,
      });

    if (memberBadge) {
      res.status(400).send({ error: 'This user already has this badge.' });
      return;
    }

    const newMemberBadge: Omit<MemberBadge, '_id'> = {
      badgeId,
      memberId,
      unlocked: new Date(),
    };

    const responseBadgeGrant = await collectionMemberBadges.insertOne(
      newMemberBadge,
    );

    /**
     * Create a "badge granted" event
     */
    const badgeGrantEvent: Omit<EventBadgeGet, '_id'> = {
      type: EventType.BADGE_GET,
      date: new Date(),
      badgeId,
      memberId,
    };
    const responseBadgeGrantEvent = await collectionEvents.insertOne(
      badgeGrantEvent,
    );

    client.close();

    if (
      !responseBadgeGrant.acknowledged ||
      !responseBadgeGrantEvent.acknowledged
    ) {
      res.status(400).send({ error: 'Could not give this badge to member.' });
    } else {
      res.status(201).send(responseBadgeGrant);
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
