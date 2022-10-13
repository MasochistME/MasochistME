import { Request, Response } from 'express';
import { MemberBadge } from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { connectToDb } from 'helpers/db';

/**
 * Returns a list of all badges belonging to a single member.
 * @param req Request
 * @param res Response
 * @return void
 */
export const getMemberBadgeList = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { client, db } = await connectToDb();
    const collection = db.collection<MemberBadge>('memberBadges');
    const { memberId } = req.params;

    const cursor = collection.find({ memberId });
    const memberBadges: MemberBadge[] = [];

    await cursor.forEach((el: MemberBadge) => {
      memberBadges.push(el);
    });

    client.close();

    res.status(200).send(memberBadges);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
