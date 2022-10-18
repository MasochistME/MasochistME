import { Request, Response } from 'express';
import { MemberGame } from '@masochistme/sdk/dist/v1/types';
import { MemberGameListParams } from '@masochistme/sdk/dist/v1/api/members';

import { log } from 'helpers/log';
import { connectToDb, sortCollection } from 'helpers/db';

/**
 * Returns a list of all games owned by a single member.
 */
export const getMemberGameList = async (
  req: Request<any, any, MemberGameListParams>,
  res: Response,
): Promise<void> => {
  try {
    const { filter = {}, sort = {}, limit = 1000 } = req.body;
    const { isCurated, ...restFilter } = filter;
    const { memberId } = req.params;

    const { client, db } = await connectToDb();
    const collection = db.collection<MemberGame>('memberGames');
    const memberBadges: MemberGame[] = [];

    const cursor = collection
      .find({
        memberId,
        ...restFilter,
        ...(isCurated !== undefined && {
          $or: [{ isCurated }, { isProtected: isCurated }],
        }),
      })
      .sort({
        ...(sort.playTime && { playTime: sortCollection(sort.playTime) }),
        ...(sort.completionPercentage && {
          completionPercentage: sortCollection(sort.completionPercentage),
        }),
        // TODO: this won't work - needs to compare with Game list
        ...(sort.tier && { tier: sortCollection(sort.tier) }),
        // TODO: this won't work - needs to compare with Game list
        ...(sort.achievementsTotal && {
          achievementsTotal: sortCollection(sort.achievementsTotal),
        }),
      })
      .limit(limit);

    await cursor.forEach((el: MemberGame) => {
      memberBadges.push(el);
    });

    client.close();

    res.status(200).send(memberBadges);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
