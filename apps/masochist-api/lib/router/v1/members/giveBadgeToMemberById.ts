import { Request, Response } from 'express';
import {
  Log,
  LogBadgeGet,
  LogType,
  MemberBadge,
} from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { mongoInstance } from 'index';

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
    const { db } = mongoInstance.getDb();
    const collectionLogs = db.collection<Omit<Log, '_id'>>('logs');
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
     * Create a "badge granted" log
     */
    const badgeGrantLog: Omit<LogBadgeGet, '_id'> = {
      type: LogType.BADGE_GET,
      date: new Date(),
      badgeId,
      memberId,
    };
    const responseBadgeGrantLog = await collectionLogs.insertOne(badgeGrantLog);

    if (
      !responseBadgeGrant.acknowledged ||
      !responseBadgeGrantLog.acknowledged
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
