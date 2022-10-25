/**
 * @module Leaderboards
 */

import { PatronTier } from 'v1/types/PatreonTier';
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
	patreonTier: PatronTier | null;
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

/**
 * Information about a single game on leaderboards.
 */
export interface GameLeaderboards {
	/**
	 * Steam ID of the game.
	 */
	gameId: number;
	/**
	 * Number of curator members that own this game.
	 */
	owners: number | null;
	/**
	 * Average playtime needed to complete the game by curator members.
	 */
	avgPlaytime: number | null;
	/**
	 * Information about game badges.
	 */
	badges: {
		/**
		 * Total points that badges of this game give.
		 */
		points: number | null;
		/**
		 * Total number of badges that this game has.
		 */
		total: number | null;
	};
	/**
	 * Information about game completions.
	 */
	completions: {
		/**
		 * Number of curator members that completed the base game.
		 */
		base: number | null;
		/**
		 * Number of curator members that unlocked all game badges.
		 */
		badges: number | null;
	};
	times: {
		/**
		 * The shortest time that a curator member needed to finish the game.
		 */
		shortestCompletion: number | null;
		/**
		 * The longest time that a curator member needed to finish the game.
		 */
		longestCompletion: number | null;
		/**
		 * Date of the newest base game completion.
		 */
		newestCompletion: Date | null;
		/**
		 * Date of the oldest base game completion.
		 */
		oldestCompletion: Date | null;
	};
}
