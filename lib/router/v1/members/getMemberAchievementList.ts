import { Request, Response } from 'express';
import { MemberAchievement } from '@masochistme/sdk/dist/v1/types';
import { MemberAchievementListParams } from '@masochistme/sdk/dist/v1/api/members';

import { log } from 'helpers/log';
import { connectToDb, sortCollection } from 'helpers/db';

/**
 * Returns a list of all achievements unlocked by a single member.
 */
export const getMemberAchievementList = async (
  req: Request<any, any, MemberAchievementListParams>,
  res: Response,
): Promise<void> => {
  try {
    const { filter = {}, sort = {}, limit = 1000 } = req.body;
    const { gameId } = filter;
    const { memberId } = req.params;

    const { client, db } = await connectToDb();
    const collection = db.collection<MemberAchievement>('memberAchievements');
    const memberBadges: MemberAchievement[] = [];

    const cursor = collection
      .find({ memberId, gameId })
      .sort({
        ...(sort.unlockTime && { unlockTime: sortCollection(sort.unlockTime) }),
      })
      .limit(limit);

    await cursor.forEach((el: MemberAchievement) => {
      memberBadges.push(el);
    });

    client.close();

    res.status(200).send(memberBadges);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
