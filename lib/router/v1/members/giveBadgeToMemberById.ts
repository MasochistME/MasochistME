import { Request, Response } from 'express';
import { MemberBadge } from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { connectToDb } from 'helpers/db';

/**
 * Gives a badge with given badge ID to member with given member ID.
 * @param req Request
 * @param res Response
 * @returns void
 */
export const giveBadgeToMemberById = async (
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

    if (memberBadge) {
      res.status(400).send({ error: 'This user already has this badge.' });
      return;
    }

    const response = await collection.insertOne({
      badgeId,
      memberId,
      unlocked: new Date(),
    });

    client.close();

    if (!response.acknowledged) {
      res.status(400).send({ error: 'Could not give this badge to member.' });
    } else {
      res.status(201).send(response);
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
