import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import {
  Game,
  Badge,
  MemberBadge,
  MemberGame,
  Patron,
  Leaderboards,
  Tier,
  TierId,
  LeaderboardsCategoryGame,
} from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { mongoInstance } from 'api';

/**
 * Returns information about member's position in MasochistME leaderboards.
 */
export const getMemberLeaderboardsPositionById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const { memberId } = req.params;

    const collectionBadges = db.collection<Badge>('badges');
    const collectionGames = db.collection<Game>('games');
    const collectionPatreon = db.collection<Patron>('patrons');
    const collectionTiers = db.collection<Tier>('tiers');

    const collectionMemberBadges = db.collection<MemberBadge>('memberBadges');
    const collectionMemberGames = db.collection<MemberGame>('memberGames');

    // Get all tiers.
    const tiersCursor = collectionTiers.find(
      {},
      { projection: { score: 1, id: 1, _id: 0 } },
    );
    const tiers: { id: TierId; score: number }[] = [];
    await tiersCursor.forEach(el => {
      tiers.push(el);
    });

    // Get member's patreon status.
    const memberPatron: Patron | null = await collectionPatreon.findOne({
      memberId,
    });

    // Get all the badges that member collected.
    const memberBadgesCursor = collectionMemberBadges.find(
      { memberId },
      { projection: { badgeId: 1, _id: 0 } },
    );
    const memberBadgeIds: ObjectId[] = [];
    await memberBadgesCursor.forEach(el => {
      memberBadgeIds.push(new ObjectId(el.badgeId));
    });

    // Summarize the point value of all the member's badges.
    const badgesCursor = collectionBadges.find({
      _id: { $in: memberBadgeIds },
    });
    let badgePoints = 0;
    await badgesCursor.forEach((el: Badge) => {
      badgePoints += el.points;
    });

    // Get all the games that member has.
    const memberGamesCursor = collectionMemberGames.find(
      // TODO THIS IS NO LONGER SOURCE OF TRUTH!!!!!!!!!!
      // Need to compare achievements unlocked with game's total number of achievements!!!
      { memberId, completionPercentage: 100 },
      { projection: { gameId: 1, _id: 0 } },
    );
    const memberGameIds: number[] = [];
    await memberGamesCursor.forEach(el => {
      memberGameIds.push(el.gameId);
    });

    // Summarize the point value of all the member's games.
    const gamesCursor = collectionGames.find({
      id: { $in: memberGameIds },
    });
    let games: LeaderboardsCategoryGame[] = tiers.map(t => ({
      tier: t.id,
      points: 0,
      total: 0,
    }));
    await gamesCursor.forEach((el: Game) => {
      games = games.map(game => {
        if (game.tier === el.tier) {
          const points = tiers.find(t => t.id === game.tier)?.score ?? 0;
          return {
            ...game,
            total: game.total + 1,
            points: game.points + points,
          };
        }
        return game;
      });
    });

    const sum = badgePoints + games.reduce((acc, curr) => acc + curr.points, 0);

    const member: Leaderboards = {
      memberId,
      position: -1,
      sum,
      patreonTier: memberPatron?.tier ?? null,
      badges: {
        total: memberBadgeIds.length,
        points: badgePoints,
      },
      games,
    };

    res.status(200).send(member);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
