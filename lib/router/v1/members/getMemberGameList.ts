import { Request, Response } from 'express';
import { MemberGame, Game } from '@masochistme/sdk/dist/v1/types';
import { MemberGameListParams } from '@masochistme/sdk/dist/v1/api/members';

import { log } from 'helpers/log';
import { mongoInstance } from 'index';
import { sortCollection } from 'helpers/db';

/**
 * Returns a list of all games owned by a single member.
 */
export const getMemberGameList = async (
  req: Request<any, any, MemberGameListParams>,
  res: Response,
): Promise<void> => {
  try {
    const { filter, sort, limit = 1000 } = req.body;
    const { memberId } = req.params;

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
     * Get all member's games.
     */
    const collection = db.collection<MemberGame>('memberGames');
    const cursorMemberGames = collection
      .find({
        memberId,
        ...filter,
      })
      .sort({
        ...(sort?.playTime && { playTime: sortCollection(sort?.playTime) }),
        // TODO: this won't work - needs to compare with Game list
        ...(sort?.tier && { tier: sortCollection(sort?.tier) }),
        // TODO: this won't work - needs to compare with Game list
        ...(sort?.achievementsTotal && {
          achievementsTotal: sortCollection(sort?.achievementsTotal),
        }),
      })
      .limit(limit);

    const memberGames: (MemberGame & { title: string })[] = [];
    await cursorMemberGames.forEach((el: MemberGame) => {
      const game = games.find(g => g.id === el.gameId);
      if (!game?.isCurated && !game?.isProtected) return;
      const gameAchievements = game?.achievementsTotal ?? 0;
      const achievementsUnlocked = el.achievementsUnlocked ?? 0;
      const completionPercentage =
        achievementsUnlocked && gameAchievements
          ? Math.round((100 * achievementsUnlocked) / gameAchievements)
          : 0;
      memberGames.push({
        ...el,
        title: game.title,
        achievementsUnlocked,
        // When game loses achievements, member can have over 100% completion ratio so we round down
        completionPercentage:
          completionPercentage > 100 ? 100 : completionPercentage,
      });
    });

    /**
     * Apply remaining filtering.
     */

    const filteredMemberGames = memberGames; // TODO

    /**
     * Apply remaining sorting.
     */
    const sortDirection = sort?.completionPercentage ?? 'desc';
    const sortedMemberGames = sort?.completionPercentage
      ? filteredMemberGames.sort((memberGameA, memberGameB) => {
          const completionPercentageSortDirection =
            sortDirection === 'desc'
              ? memberGameB.completionPercentage -
                memberGameA.completionPercentage
              : memberGameA.completionPercentage -
                memberGameB.completionPercentage;
          return completionPercentageSortDirection;
        })
      : filteredMemberGames;

    res.status(200).send(sortedMemberGames);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
