import { MemberBadgeListParams } from '@masochistme/sdk/dist/v1/api/members';
import { MemberBadge } from '@masochistme/sdk/dist/v1/types';
import { mongoInstance } from 'api';
import { Request, Response } from 'express';
import { sortCollection } from 'helpers/db';
import { log } from 'helpers/log';

/**
 * Returns a list of all badges belonging to a single member.
 */
export const getMemberBadgeList = async (
  req: Request<any, any, MemberBadgeListParams>,
  res: Response,
): Promise<void> => {
  try {
    const { filter = {}, sort = {}, limit = 1000 } = req.body;
    const { isEnabled, isLegacy, isSteamGame, ...restFilter } = filter;
    const { memberId } = req.params;

    const { db } = mongoInstance.getDb();
    const collection = db.collection<MemberBadge>('memberBadges');
    const memberBadges: MemberBadge[] = [];

    const cursor = collection
      .find({
        memberId,
        ...restFilter,
        ...(isEnabled !== undefined && { isEnabled }),
        ...(isLegacy !== undefined && { isLegacy }),
        ...(isSteamGame !== undefined && { isSteamGame }),
      })
      .sort({
        ...(sort.points && { points: sortCollection(sort.points) }),
      })
      .limit(limit);

    await cursor.forEach((el: MemberBadge) => {
      memberBadges.push(el);
    });

    res.status(200).send(memberBadges);
  } catch (err: unknown) {
    log.ERROR(err);
    res.status(500).send({ error: err ?? 'Internal server error' });
  }
};
