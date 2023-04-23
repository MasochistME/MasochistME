import e, { Request, Response } from 'express';
import { Member, MemberGame, Game } from '@masochistme/sdk/dist/v1/types';
import { GameCompletionListParams } from '@masochistme/sdk/dist/v1/api/games';

import { log } from 'helpers/log';
import { sortCollection } from 'helpers/db';
import { mongoInstance } from 'index';

/**
 * Returns a list of game completions from MasochistME members.
 */
export const getGameCompletionList = async (
  req: Request<any, any, GameCompletionListParams>,
  res: Response,
): Promise<void> => {
  try {
    const { filter = {}, sort, limit = 1000 } = req.body;
    const { completed, ...restFilter } = filter;
    const { db } = mongoInstance.getDb();

    /**
     * Get all curated games.
     */
    const collectionGames = db.collection<Game>('games');
    const games: Game[] = [];
    const cursorGames = collectionGames.find({
      $or: [{ isCurated: true }, { isProtected: true }],
    });
    await cursorGames.forEach(el => {
      games.push(el);
    });

    /**
     * Get all completions of the specified game.
     */

    const collectionMemberGames = db.collection<MemberGame>('memberGames');
    const cursorMemberGames = collectionMemberGames
      .find({
        ...restFilter,
      })
      .sort({
        ...(sort?.playTime && { playTime: sortCollection(sort?.playTime) }),
        ...(sort?.mostRecentAchievementDate && {
          mostRecentAchievementDate: sortCollection(
            sort?.mostRecentAchievementDate,
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
    const memberGames: MemberGame[] = [];
    await cursorMemberGames.forEach((el: MemberGame) => {
      if (!curatorMembers.includes(el.memberId)) return;
      const gameAchievements =
        games.find(g => g.id === el.gameId)?.achievementsTotal ?? 0;
      const achievementsUnlocked = el.achievementsUnlocked ?? 0;
      const completionPercentage =
        achievementsUnlocked && gameAchievements
          ? Math.round((100 * achievementsUnlocked) / gameAchievements)
          : 0;
      memberGames.push({
        ...el,
        achievementsUnlocked,
        // When game loses achievements, member can have over 100% completion ratio so we round down
        completionPercentage:
          completionPercentage > 100 ? 100 : completionPercentage,
      });
    });

    /**
     * Apply remaining filtering.
     */
    const filteredMemberGames = memberGames.filter(memberGame => {
      if (completed === undefined) return true;
      if (completed) return memberGame.completionPercentage === 100;
      else return memberGame.completionPercentage !== 100;
    });

    /**
     * Apply remaining sorting.
     */
    const sortDirection = sort?.completionPercentage ?? 'desc';
    const sortedMemberGames = filteredMemberGames.sort(
      (memberGameA: MemberGame, memberGameB: MemberGame) => {
        // sort from highest to lowest completion
        if (sortDirection === 'desc')
          return (
            memberGameB.completionPercentage - memberGameA.completionPercentage
          );
        // sort from lowest to highest completion
        else
          return (
            memberGameA.completionPercentage - memberGameB.completionPercentage
          );
      },
    );

    res.status(200).send(sortedMemberGames);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
