import { Request, Response } from 'express';
import { MemberBadge, Event } from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { connectToDb } from 'helpers/db';

/**
 * Removes a badge with given badge ID from member with given member ID.
 * @param req Request
 * @param res Response
 * @return void
 */
export const revokeBadgeFromMemberById = async (
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
     * Remove badge from member
     */
    const removedMemberBadge: MemberBadge | null =
      await collectionMemberBadges.findOne({
        badgeId,
        memberId,
      });

    if (!removedMemberBadge) {
      res.status(400).send({ error: 'This member does not have this badge.' });
      return;
    }

    const responseBadgeRevoke = await collectionMemberBadges.deleteOne({
      badgeId,
      memberId,
    });

    /**
     * Remove event with badge grant
     */
    const responseBadgeRevokeEvent = await collectionEvents.deleteOne({
      badgeId,
      memberId,
    });

    client.close();

    if (
      !responseBadgeRevoke.acknowledged ||
      !responseBadgeRevokeEvent.acknowledged
    ) {
      res
        .status(400)
        .send({ error: 'Could not remove this badge from member.' });
    } else {
      res.status(200).send(responseBadgeRevoke);
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
