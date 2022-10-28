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
	 * @deprecated Please use `achievementsUnlocked` instead!
	 * A number from 0 to 100 representing the completion percentage of a game (counted by the achievement completion).
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
