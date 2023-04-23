/**
 * @module Logs
 */
import { WithId } from 'v1/types/__Helpers';

/**
 * Enum describing various types of logs.
 */
export enum LogType {
	COMPLETE = 'hundo',
	MEMBER_JOIN = 'memberJoin',
	MEMBER_LEAVE = 'memberLeave',
	GAME_TIER_CHANGE = 'gameTierChange',
	GAME_ADD = 'gameCurate',
	GAME_REMOVE = 'gameRemove',
	BADGE_CREATE = 'badgeCreate',
	BADGE_GET = 'badgeGrant',
	ACHIEVEMENTS_CHANGE = 'achievementNumberChange',
	CUSTOM = 'custom',
}

/**
 * This is a type of a single object within the collection "logs".
 * A single object describes a single log.
 *
 * **Important**: there are several BREAKING changes here in comparison to the legacy Log format:
 *
 * - `member` → **renamed** to `memberId`
 * - `game` → **renamed** to `gameId`
 * - `badge` → **renamed** to `badgeId`
 */
export type Log =
	| LogBadgeCreate
	| LogBadgeGet
	| LogComplete
	| LogGameAdd
	| LogGameRemove
	| LogGameTierChange
	| LogMemberJoin
	| LogMemberLeave
	| LogAchievementNumberChange
	| LogCustom;

/**
 * Fields which are common for all types of logs.
 */
export interface HistoryLog extends WithId {
	/**
	 * Date of the log.
	 */
	date: Date;
	/**
	 * Type of the log.
	 */
	type: keyof typeof LogType;
}

/**
 * Log generated when Masochist.ME member completes a curated game.
 */
export interface LogComplete extends Omit<HistoryLog, 'type'> {
	/**
	 * Type of the log.
	 */
	type: LogType.COMPLETE;
	/**
	 * Steam ID of the member who completed a game.
	 */
	memberId: string;
	/**
	 * Steam ID of the game that got completed by member (or a title if it's a non-Steam game).
	 */
	gameId: string | number;
}

/**
 * Log generated when a new member joins Masochist.ME Steam curator.
 */
export interface LogMemberJoin extends Omit<HistoryLog, 'type'> {
	/**
	 * Type of the log.
	 */
	type: LogType.MEMBER_JOIN;
	/**
	 * Steam ID of the member who joined the curator.
	 */
	memberId: string;
}

/**
 * Log generated when a Masochist.ME member leaves the Steam curator.
 */
export interface LogMemberLeave extends Omit<HistoryLog, 'type'> {
	/**
	 * Type of the log.
	 */
	type: LogType.MEMBER_LEAVE;
	/**
	 * Steam ID of the member who left the curator.
	 */
	memberId: string;
}

/**
 * Log generated when a Masochist.ME curated game changes its tier.
 */
export interface LogGameTierChange extends Omit<HistoryLog, 'type'> {
	/**
	 * Type of the log.
	 */
	type: LogType.GAME_TIER_CHANGE;
	/**
	 * Steam ID of the game that changed its tier.
	 */
	gameId: number;
	/**
	 * Previous tier of the game.
	 */
	oldTier: string | number;
	/**
	 * New tier of the game.
	 */
	newTier: string | number;
}

/**
 * Log generated when a new Steam game gets curated by the Masochist.ME curator.
 */
export interface LogGameAdd extends Omit<HistoryLog, 'type'> {
	/**
	 * Type of the log.
	 */
	type: LogType.GAME_ADD;
	/**
	 * Steam ID of the game which got added to the curator.
	 */
	gameId: number;
}

/**
 * Log generated when a Steam game gets removed from the Masochist.ME curator.
 */
export interface LogGameRemove extends Omit<HistoryLog, 'type'> {
	/**
	 * Type of the log.
	 */
	type: LogType.GAME_REMOVE;
	/**
	 * Steam ID of the game which got removed from the curator.
	 */
	gameId: number;
}

/**
 * Log generated when a new Masochist.ME badge is created.
 */
export interface LogBadgeCreate extends Omit<HistoryLog, 'type'> {
	/**
	 * Type of the log.
	 */
	type: LogType.BADGE_CREATE;
	/**
	 * ID of the badge that got created (based on its stringified ObjectID).
	 */
	badgeId: string;
	/**
	 * Steam ID of the game that got a new badge (or its title if it's a non-Steam game).
	 */
	gameId: string | number;
}

/**
 * Log generated when a Masochist.ME member gets assigned a badge.
 * */
export interface LogBadgeGet extends Omit<HistoryLog, 'type'> {
	/**
	 * Type of the log.
	 */
	type: LogType.BADGE_GET;
	/**
	 * ID of the badge that got granted to member (based on its stringified ObjectID).
	 */
	badgeId: string;
	/**
	 * Steam ID of the member who got granted the badge.
	 */
	memberId: string;
}

/**
 * Log generated when a Masochist.ME curated game changes its number of achievements.
 */
export interface LogAchievementNumberChange extends Omit<HistoryLog, 'type'> {
	/**
	 * Type of the log.
	 */
	type: LogType.ACHIEVEMENTS_CHANGE;
	/**
	 * Steam ID of the game that changed its tier.
	 */
	gameId: number;
	/**
	 * Previous number of achievements.
	 */
	oldNumber: number;
	/**
	 * New number of achievements.
	 */
	newNumber: number;
}

/**
 * A custom log.
 */
export interface LogCustom extends Omit<HistoryLog, 'type'> {
	/**
	 * Type of the log.
	 */
	type: LogType.CUSTOM;
	/**
	 * Content of the log.
	 */
	content: {
		/**
		 * Text to be displayed alongside log.
		 */
		text: string;
		/**
		 * FontAwesome icon to be shown in the log.
		 */
		icon: string;
		/**
		 * Steam ID of the member who is involved in the log.
		 */
		memberId: string;
	};
}
