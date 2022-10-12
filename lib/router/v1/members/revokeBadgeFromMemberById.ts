import { Request, Response } from 'express';
import { MemberBadge } from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { connectToDb } from 'helpers/db';

/**
 * Removes a badge with given badge ID from member with given member ID.
 * @param req Request
 * @param res Response
 * @returns void
 */
export const revokeBadgeFromMemberById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { client, db } = await connectToDb();
    const collection = db.collection<Omit<MemberBadge, '_id'>>('memberBadges');
    const { badgeId, memberId } = req.params;

    const memberBadge: MemberBadge | null = await collection.findOne({
      badgeId,
      memberId,
    });

    if (!memberBadge) {
      res.status(400).send({ error: 'This member does not have this badge.' });
      return;
    }

    const response = await collection.deleteOne({ badgeId, memberId });

    client.close();

    if (!response.acknowledged) {
      res
        .status(400)
        .send({ error: 'Could not remove this badge from member.' });
    } else {
      res.status(200).send(response);
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
