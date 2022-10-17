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

import { log } from 'helpers/log';
import { connectToDb } from 'helpers/db';

/**
 * Returns MasochistME leaderboards.
 */
export const getLeaderboardsList = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { client, db } = await connectToDb();

    const collectionMembers = db.collection<Member>('members');
    const collectionBadges = db.collection<Badge>('badges');
    const collectionGames = db.collection<Game>('games');
    const collectionPatron = db.collection<Patron>('patrons');
    const collectionTiers = db.collection<Tier>('tiers');

    const collectionMemberBadges = db.collection<MemberBadge>('memberBadges');
    const collectionMemberGames = db.collection<MemberGame>('memberGames');

    // Get all members.
    const membersCursor = collectionMembers.find(
      {},
      { projection: { steamId: 1, _id: 0 } },
    );
    const membersIds: string[] = [];
    await membersCursor.forEach(el => {
      membersIds.push(el.steamId);
    });

    // Get all games.
    const gamesCursor = collectionGames.find(
      {},
      { projection: { id: 1, tier: 1, _id: 0 } },
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
    const memberGamesCursor = collectionMemberGames.find(
      { completionPercentage: 100 },
      { projection: { gameId: 1, memberId: 1, _id: 0 } },
    );
    const membersGames: (MemberGame & { tier: TierId | null })[] = [];
    await memberGamesCursor.forEach((el: MemberGame) => {
      membersGames.push({
        ...el,
        tier: games.find(game => game.id === el.gameId)?.tier ?? null,
      });
    });

    // Get all badges from all members.
    const memberBadgesCursor = collectionMemberBadges.find(
      {},
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

    client.close();

    const leaderboards: Leaderboards[] = membersIds.map(memberId => {
      const memberGames = membersGames.filter(
        memberGame => memberGame.memberId === memberId,
      );
      let memberLeaderboardsGames = tiers.map(t => ({
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
        memberBadge => memberBadge.memberId === memberId,
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
      .sort((a: Leaderboards, b: Leaderboards) => b.sum - a.sum)
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
