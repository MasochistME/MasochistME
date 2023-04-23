import { Request, Response } from 'express';
import {
  Badge,
  Game,
  Leaderboards,
  Member,
  MemberBadge,
  MemberGame,
  Patron,
  Tier,
  TierId,
} from '@masochistme/sdk/dist/v1/types';
import { LeaderboardsMembersListParams } from '@masochistme/sdk/dist/v1/api/leaderboards';

import { log } from 'helpers/log';
import { mongoInstance } from 'index';

/**
 * Returns MasochistME leaderboards.
 */
export const getLeaderboardsMembersList = async (
  req: Request<any, any, LeaderboardsMembersListParams>,
  res: Response,
): Promise<void> => {
  try {
    const { filter = {}, sort, limit = 1000 } = req.body;
    const { isMember, from, to, ...restFilter } = filter;
    const { db } = mongoInstance.getDb();

    const collectionMembers = db.collection<Member>('members');
    const collectionBadges = db.collection<Badge>('badges');
    const collectionGames = db.collection<Game>('games');
    const collectionPatron = db.collection<Patron>('patrons');
    const collectionTiers = db.collection<Tier>('tiers');

    const collectionMemberBadges = db.collection<MemberBadge>('memberBadges');
    const collectionMemberGames = db.collection<MemberGame>('memberGames');

    // Get all members.
    const membersCursor = collectionMembers.find(
      {
        ...restFilter,
        ...(isMember !== undefined && {
          $or: [{ isMember }, { isProtected: isMember }],
        }),
      },
      { projection: { steamId: 1, _id: 0 } },
    );
    const membersIds: string[] = [];
    await membersCursor.forEach(el => {
      membersIds.push(el.steamId);
    });

    // Get all games.
    const gamesCursor = collectionGames.find(
      {},
      { projection: { id: 1, tier: 1, achievementsTotal: 1, _id: 0 } },
    );
    const games: Game[] = [];
    await gamesCursor.forEach(el => {
      games.push(el);
    });

    // Get all badges.
    const badgesCursor = collectionBadges.find(
      {},
      { projection: { points: 1, _id: 1 } },
    );
    const badges: Badge[] = [];
    await badgesCursor.forEach(el => {
      badges.push(el);
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
    const memberGamesCursor = collectionMemberGames.find({
      ...(from && { mostRecentAchievementDate: { $gte: new Date(from) } }),
      ...(to && { mostRecentAchievementDate: { $lte: new Date(to) } }),
    });
    const rawMembersGames: (MemberGame & { tier: TierId | null })[] = [];
    await memberGamesCursor.forEach((el: MemberGame) => {
      rawMembersGames.push({
        ...el,
        tier: games.find(game => game.id === el.gameId)?.tier ?? null,
      });
    });

    // Filter all games from all members to only completed ones.
    const membersGames = rawMembersGames
      .map(rawGame => {
        const game = games.find(g => g.id === rawGame.gameId);
        const gameAchievements = game?.achievementsTotal ?? 0;
        const memberAchievementsUnlocked = rawGame?.achievementsUnlocked ?? 0;
        const completionPercentage = Math.round(
          100 * (memberAchievementsUnlocked / gameAchievements),
        );
        // We do that in case there are games that lost achievements.
        const fixedCompletionPercentage =
          completionPercentage > 100 ? 100 : completionPercentage;
        return {
          ...rawGame,
          completionPercentage: Number.isNaN(fixedCompletionPercentage)
            ? 0
            : fixedCompletionPercentage,
        };
      })
      .filter(rawGame => {
        return rawGame.completionPercentage === 100;
      });

    // Get all badges from all members.
    const memberBadgesCursor = collectionMemberBadges.find(
      {
        ...(from && { unlocked: { $gte: new Date(from) } }),
        ...(to && { unlocked: { $lte: new Date(to) } }),
      },
      { projection: { badgeId: 1, memberId: 1, _id: 0 } },
    );
    const membersBadges: MemberBadge[] = [];
    await memberBadgesCursor.forEach((el: MemberBadge) => {
      membersBadges.push(el);
    });

    // Get all patrons.
    const patronsCursor = collectionPatron.find();
    const patrons: Patron[] = [];
    await patronsCursor.forEach((el: Patron) => {
      patrons.push(el);
    });

    const leaderboards: Leaderboards[] = membersIds.map(memberId => {
      const memberGames = membersGames.filter(
        memberGame => memberGame.memberId === memberId,
      );
      let memberLeaderboardsGames = tiers
        .sort((a, b) => a.score - b.score)
        .map(t => ({
          tier: t.id,
          points: 0,
          total: 0,
        }));

      memberGames.forEach(memberGame => {
        memberLeaderboardsGames = memberLeaderboardsGames.map(
          leaderboardsGame => {
            if (memberGame.tier === leaderboardsGame.tier) {
              const points =
                tiers.find(t => t.id === leaderboardsGame.tier)?.score ?? 0;
              return {
                ...leaderboardsGame,
                total: leaderboardsGame.total + 1,
                points: leaderboardsGame.points + points,
              };
            }
            return leaderboardsGame;
          },
        );
      });

      const memberBadges = membersBadges.filter(
        memberBadge =>
          memberBadge.memberId === memberId &&
          badges.find(b => String(b._id) === memberBadge.badgeId),
      );

      const patreonTier =
        patrons.find(p => p.memberId === memberId)?.tier ?? null;

      const badgePoints = memberBadges
        .map(
          badge =>
            badges.find(b => String(b._id) === badge.badgeId)?.points ?? 0,
        )
        .reduce<number>((sum, curr) => sum + curr, 0);

      const sum =
        badgePoints +
        memberLeaderboardsGames.reduce((acc, curr) => acc + curr.points, 0);

      return {
        memberId,
        position: -1,
        sum,
        games: memberLeaderboardsGames,
        badges: {
          points: badgePoints,
          total: memberBadges.length,
        },
        patreonTier,
      };
    });

    const sortedLeaderboards = leaderboards
      .sort((a: Leaderboards, b: Leaderboards) => {
        if (sort?.gamesTotal) {
          return sort.gamesTotal === 'desc' ? b.sum - a.sum : a.sum - b.sum;
        }
        if (sort?.badgesTotal) {
          return sort.badgesTotal === 'desc'
            ? b.badges.total - a.badges.total
            : a.badges.total - b.badges.total;
        }
        if (sort?.gamePoints) {
          return sort.gamePoints === 'desc' ? b.sum - a.sum : a.sum - b.sum;
        }
        if (sort?.badgePoints) {
          return sort.badgePoints === 'desc'
            ? b.badges.points - a.badges.points
            : a.badges.points - b.badges.points;
        }
        if (sort?.position) {
          return sort.position === 'desc' ? b.sum - a.sum : a.sum - b.sum;
        }
        return b.sum - a.sum;
      })
      .slice(0, limit)
      .map((member: Leaderboards, index: number) => ({
        ...member,
        position: index + 1,
      }));

    res.status(200).send(sortedLeaderboards);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
