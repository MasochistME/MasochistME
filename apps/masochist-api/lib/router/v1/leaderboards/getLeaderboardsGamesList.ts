import { Request, Response } from 'express';
import {
  GameLeaderboards,
  Badge,
  Game,
  Member,
  MemberBadge,
  MemberGame,
  Tier,
} from '@masochistme/sdk/dist/v1/types';
import { LeaderboardsGamesListParams } from '@masochistme/sdk/dist/v1/api/leaderboards';

import { log } from 'helpers/log';
import { mongoInstance } from 'api';

/**
 * Returns MasochistME leaderboards.
 */
export const getLeaderboardsGamesList = async (
  req: Request<any, any, LeaderboardsGamesListParams>,
  res: Response,
): Promise<void> => {
  try {
    const { limit = 1000 } = req.body;
    const { db } = mongoInstance.getDb();

    const collectionMembers = db.collection<Member>('members');
    const collectionGames = db.collection<Game>('games');
    const collectionTiers = db.collection<Tier>('tiers');
    const collectionBadges = db.collection<Badge>('badges');

    const collectionMemberBadges = db.collection<MemberBadge>('memberBadges');
    const collectionMemberGames = db.collection<MemberGame>('memberGames');

    // Get all members.
    const membersCursor = collectionMembers.find(
      { $or: [{ isMember: true }, { isProtected: true }] },
      { projection: { steamId: 1, _id: 0 } },
    );
    const membersIds: string[] = [];
    await membersCursor.forEach(el => {
      membersIds.push(el.steamId);
    });

    // Get all games.
    const gamesCursor = collectionGames.find();
    const games: Game[] = [];
    await gamesCursor.forEach(el => {
      if (el.isCurated || el.isProtected) games.push(el);
    });

    // Get all badges.
    const badgesCursor = collectionBadges.find();
    const badges: Badge[] = [];
    await badgesCursor.forEach(el => {
      if (el.isEnabled && !el.isLegacy) badges.push(el);
    });

    // Get all tiers.
    const tiersCursor = collectionTiers.find(
      {},
      { projection: { score: 1, id: 1, _id: 0 } },
    );
    const tiers: Tier[] = [];
    await tiersCursor.forEach(el => {
      tiers.push(el);
    });

    // Get all games from all members.
    const memberGamesCursor = collectionMemberGames.find();
    const membersGames: MemberGame[] = [];
    await memberGamesCursor.forEach((el: MemberGame) => {
      if (membersIds.includes(el.memberId)) membersGames.push(el);
    });

    // Get all badges from all members.
    const memberBadgesCursor = collectionMemberBadges.find();
    const membersBadges: MemberBadge[] = [];
    await memberBadgesCursor.forEach((el: MemberBadge) => {
      if (membersIds.includes(el.memberId)) membersBadges.push(el);
    });

    const gameLeaderboards: GameLeaderboards[] = games.map((game: Game) => {
      const owners =
        membersGames.filter(memberGame => memberGame.gameId === game.id) ?? [];
      const completions = owners.filter(
        owner =>
          owner.achievementsUnlocked / game.achievementsTotal >= 1 &&
          !!owner.playTime,
      );
      const avgPlaytime = completions?.length
        ? completions.reduce((sum, owner) => {
            const ownerPlayTime = !Number.isNaN(Number(owner.playTime))
              ? owner.playTime
              : 0;
            return (sum += ownerPlayTime);
          }, 0) / completions.length
        : 0;

      const newestCompletion =
        Math.max(
          ...completions.map(completion =>
            new Date(completion.mostRecentAchievementDate).getTime(),
          ),
        ) ?? 0;
      const oldestCompletion =
        Math.min(
          ...completions.map(completion =>
            new Date(completion.mostRecentAchievementDate).getTime(),
          ),
        ) ?? 0;

      const gameBadges = badges.filter(badge => badge.gameId === game.id);
      const badgePoints =
        gameBadges.reduce(
          (sum, badge) => (badge.points > 0 ? (sum += badge.points) : sum),
          0,
        ) ?? 0;

      // TODO add completions with badges

      return {
        gameId: game.id,
        owners: owners.length,
        avgPlaytime,
        completions: {
          base: completions.length,
          badges: -1,
        },
        times: {
          shortestCompletion: Math.min(...completions.map(c => c.playTime)),
          longestCompletion: Math.max(...completions.map(c => c.playTime)),
          newestCompletion: new Date(newestCompletion),
          oldestCompletion: new Date(oldestCompletion),
        },
        badges: {
          points: badgePoints,
          total: gameBadges.length,
        },
      };
    });

    const fixedGameLeaderboards = gameLeaderboards.slice(0, limit);

    res.status(200).send(fixedGameLeaderboards);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
