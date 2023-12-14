import { Request, Response } from 'express';
import { MemberCheese } from '@masochistme/sdk/dist/v1/types';
import { MemberCheeseListParams } from '@masochistme/sdk/dist/v1/api/members';

import { log } from 'helpers/log';
import { mongoInstance } from 'api';

/**
 * Returns a list of all cheese belonging to a single member.
 */
export const getMemberCheeseList = async (
  req: Request<any, any, MemberCheeseListParams>,
  res: Response,
): Promise<void> => {
  try {
    // const {  } = req.body; // This endpoint has no filters ATM
    const { memberId } = req.params;

    const { db } = mongoInstance.getDb();
    const collection = db.collection<MemberCheese>('memberCheese');
    const memberCheese: MemberCheese[] = [];

    const cursor = collection.find({ memberId });

    await cursor.forEach((el: MemberCheese) => {
      memberCheese.push(el);
    });

    res.status(200).send(memberCheese);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
