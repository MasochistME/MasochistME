/**
 * @module Leaderboards
 */

import { TierId } from './Tier';

/**
 * Information about a single member on leaderboards.
 */
export interface Leaderboards {
	/**
	 * Steam ID of the member.
	 */
	memberId: string;
	/**
	 * Member's position on the leaderboards.
	 */
	position: number;
	/**
	 * Patreon tier of the member.
	 */
	patreonTier: number | null;
	/**
	 * Statistics about the member's unlocked badges.
	 */
	badges: LeaderboardsCategory;
	/**
	 * Statistics about the member's completed games.
	 */
	games: LeaderboardsCategoryGame[];
	/**
	 * Sum of all the points that member has.
	 */
	sum: number;
}

/**
 * A base leaderboards category.
 */
export interface LeaderboardsCategory {
	/**
	 * Total number of points that member earned in this category.
	 */
	points: number;
	/**
	 * Total number of games/badges that member unlocked.
	 */
	total: number;
}

/**
 * Base leaderboards category expanded with game's tier.
 */
export interface LeaderboardsCategoryGame extends LeaderboardsCategory {
	tier: TierId;
}
