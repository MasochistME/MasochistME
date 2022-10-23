import { Request, Response } from 'express';
import { Member, MemberGame } from '@masochistme/sdk/dist/v1/types';
import { GameCompletionListParams } from '@masochistme/sdk/dist/v1/api/games';

import { log } from 'helpers/log';
import { connectToDb, sortCollection } from 'helpers/db';

/**
 * Returns a list of game completions from MasochistME members.
 */
export const getGameCompletionList = async (
  req: Request<any, any, GameCompletionListParams>,
  res: Response,
): Promise<void> => {
  try {
    const { filter = {}, sort = {}, limit = 1000 } = req.body;
    const { completed, ...restFilter } = filter;
    const { gameId } = req.params;
    const { client, db } = await connectToDb();

    /**
     * Get all completions of the specified game.
     */
    const collectionMemberGames = db.collection<MemberGame>('memberGames');
    const games: MemberGame[] = [];
    const cursorMemberGames = collectionMemberGames
      .find({
        gameId: Number(gameId),
        ...restFilter,
        ...(completed !== undefined && { completionPercentage: 100 }),
      })
      .sort({
        ...(sort.playTime && { playTime: sortCollection(sort.playTime) }),
        ...(sort.completionPercentage && {
          completionPercentage: sortCollection(sort.completionPercentage),
        }),
        ...(sort.mostRecentAchievementDate && {
          mostRecentAchievementDate: sortCollection(
            sort.mostRecentAchievementDate,
          ),
        }),
      })
      .limit(limit);

    /**
     * Get a list of curator members' IDs.
     */
    const collectionMembers = db.collection<Member>('members');
    const curatorMembers: string[] = [];
    const cursorMembers = collectionMembers.find({
      $or: [{ isMember: true }, { isProtected: true }],
    });
    await cursorMembers.forEach((el: Member) => {
      curatorMembers.push(el.steamId);
    });

    /**
     * Filter completions by curator members only.
     */
    await cursorMemberGames.forEach((el: MemberGame) => {
      if (curatorMembers.includes(el.memberId)) games.push(el);
    });

    client.close();

    res.status(200).send(games);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
