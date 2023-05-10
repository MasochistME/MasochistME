import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { Badge, MemberBadge } from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { mongoInstance } from 'api';

/**
 * Deletes a badge with a given badge ID, and removes it from all members that have it.
 * @param req Request
 * @param res Response
 * @return void
 */
export const deleteBadgeById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const collectionBadges = db.collection<Badge>('badges');
    const collectionMemberBadges = db.collection<MemberBadge>('memberBadges');
    const _id = new ObjectId(req.params.badgeId);

    const responseBadges = await collectionBadges.deleteOne({ _id });
    const responseMemberBadges = await collectionMemberBadges.deleteMany({
      badgeId: String(_id),
    });

    if (!responseBadges.acknowledged || !responseMemberBadges.acknowledged) {
      res.status(404).send({ error: 'Could not delete the badge.' });
    } else {
      res.status(200).send(responseBadges);
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
