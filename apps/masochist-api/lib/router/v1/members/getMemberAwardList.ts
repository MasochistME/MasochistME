import { MemberAwardListParams } from '@masochistme/sdk/dist/v1/api/members';
import { MemberAward } from '@masochistme/sdk/dist/v1/types';
import { mongoInstance } from 'api';
import { Request, Response } from 'express';
import { log } from 'helpers/log';

/**
 * Returns a list of all awards belonging to a single member.
 */
export const getMemberAwardList = async (
  req: Request<any, any, MemberAwardListParams>,
  res: Response,
): Promise<void> => {
  try {
    const { filter = {}, sort = {}, limit = 1000 } = req.body;
    const { category, isEnabled, isLegacy, ...restFilter } = filter;
    const { memberId } = req.params;

    const { db } = mongoInstance.getDb();
    const collection = db.collection<MemberAward>('memberAwards');
    const memberAwards: MemberAward[] = [];

    const cursor = collection
      .find({
        memberId,
        ...restFilter,
        ...(category && { category }),
        ...(isEnabled !== undefined && { isEnabled }),
        ...(isLegacy !== undefined && { isLegacy }),
      })
      // .sort({}) // This field is unused atm
      .limit(limit);

    await cursor.forEach((el: MemberAward) => {
      memberAwards.push(el);
    });

    res.status(200).send(memberAwards);
  } catch (err: unknown) {
    log.ERROR(err);
    res.status(500).send({ error: err ?? 'Internal server error' });
  }
};
