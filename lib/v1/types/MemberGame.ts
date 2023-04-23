/**
 * @module Members
 */

import { WithId } from 'v1/types/__Helpers';

/**
 * This is a type of a single object within the collection "memberGames".
 * A single object describes a single curator game belonging to a single member.
 */
export interface MemberGame extends WithId {
	/**
	 * Steam ID of the member who has the game.
	 */
	memberId: string;
	/**
	 * Steam ID of the game.
	 */
	gameId: number;
	/**
	 * Number of hours that member spent playing this game.
	 * **Important**: currently this field is called `playtime_forever` and is stored as a string.
	 */
	playTime: number;
	/**
	 * Completion percentage of a game. (This should not be taken from database but from API exclusively)
	 */
	completionPercentage: number;
	/**
	 * Number of achievements that this member unlocked in this game.
	 */
	achievementsUnlocked: number;
	/**
	 * Date when member unlocked the most recent achievement.
	 * **Important**: currently this field is called `lastUnlocked` and is stored as a number (timestamp).
	 */
	mostRecentAchievementDate: Date;
}
