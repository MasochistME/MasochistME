import { Request, Response } from 'express';
import { MemberBadge, Log } from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { mongoInstance } from 'api';

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
    const { db } = mongoInstance.getDb();
    const collectionLogs = db.collection<Omit<Log, '_id'>>('logs');
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
     * Remove log with badge grant
     */
    const responseBadgeRevokeLog = await collectionLogs.deleteOne({
      badgeId,
      memberId,
    });

    if (
      !responseBadgeRevoke.acknowledged ||
      !responseBadgeRevokeLog.acknowledged
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
