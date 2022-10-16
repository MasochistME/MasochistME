/**
 * @module Events
 */
import { WithId } from 'v1/types/Mongo';

/**
 * Enum describing various types of events.
 */
export enum EventType {
	COMPLETE = 'complete',
	MEMBER_JOIN = 'memberJoined',
	MEMBER_LEAVE = 'memberLeft',
	GAME_TIER_CHANGE = 'tierChange',
	GAME_ADD = 'newGame',
	GAME_REMOVE = 'gameRemoved',
	BADGE_CREATE = 'badgeAdded',
	BADGE_GET = 'badgeGiven',
	ACHIEVEMENTS_CHANGE = 'achievementNumberChange',
	CUSTOM = 'custom',
}

/**
 * This is a type of a single object within the collection "events".
 * A single object describes a single event.
 *
 * **Important**: there are several BREAKING changes here in comparison to the legacy Event format:
 *
 * - `member` → **renamed** to `memberId`
 * - `game` → **renamed** to `gameId`
 * - `badge` → **renamed** to `badgeId`
 */
export type Event =
	| EventBadgeCreate
	| EventBadgeGet
	| EventComplete
	| EventGameAdd
	| EventGameRemove
	| EventGameTierChange
	| EventMemberJoin
	| EventMemberLeave
	| EventAchievementNumberChange
	| EventCustom;

/**
 * Fields which are common for all types of events.
 */
export interface BaseEvent extends WithId {
	/**
	 * Date of the event.
	 */
	date: Date;
	/**
	 * Type of the event.
	 */
	type: keyof typeof EventType;
}

/**
 * Event generated when Masochist.ME member completes a curated game.
 */
export interface EventComplete extends Omit<BaseEvent, 'type'> {
	/**
	 * Type of the event.
	 */
	type: EventType.COMPLETE;
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
 * Event generated when a new member joins Masochist.ME Steam curator.
 */
export interface EventMemberJoin extends Omit<BaseEvent, 'type'> {
	/**
	 * Type of the event.
	 */
	type: EventType.MEMBER_JOIN;
	/**
	 * Steam ID of the member who joined the curator.
	 */
	memberId: string;
}

/**
 * Event generated when a Masochist.ME member leaves the Steam curator.
 */
export interface EventMemberLeave extends Omit<BaseEvent, 'type'> {
	/**
	 * Type of the event.
	 */
	type: EventType.MEMBER_LEAVE;
	/**
	 * Steam ID of the member who left the curator.
	 */
	memberId: string;
}

/**
 * Event generated when a Masochist.ME curated game changes its tier.
 */
export interface EventGameTierChange extends Omit<BaseEvent, 'type'> {
	/**
	 * Type of the event.
	 */
	type: EventType.GAME_TIER_CHANGE;
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
 * Event generated when a new Steam game gets curated by the Masochist.ME curator.
 */
export interface EventGameAdd extends Omit<BaseEvent, 'type'> {
	/**
	 * Type of the event.
	 */
	type: EventType.GAME_ADD;
	/**
	 * Steam ID of the game which got added to the curator.
	 */
	gameId: number;
}

/**
 * Event generated when a Steam game gets removed from the Masochist.ME curator.
 */
export interface EventGameRemove extends Omit<BaseEvent, 'type'> {
	/**
	 * Type of the event.
	 */
	type: EventType.GAME_REMOVE;
	/**
	 * Steam ID of the game which got removed from the curator.
	 */
	gameId: number;
}

/**
 * Event generated when a new Masochist.ME badge is created.
 */
export interface EventBadgeCreate extends Omit<BaseEvent, 'type'> {
	/**
	 * Type of the event.
	 */
	type: EventType.BADGE_CREATE;
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
 * Event generated when a Masochist.ME member gets assigned a badge.
 * */
export interface EventBadgeGet extends Omit<BaseEvent, 'type'> {
	/**
	 * Type of the event.
	 */
	type: EventType.BADGE_GET;
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
 * Event generated when a Masochist.ME curated game changes its number of achievements.
 */
export interface EventAchievementNumberChange extends Omit<BaseEvent, 'type'> {
	/**
	 * Type of the event.
	 */
	type: EventType.ACHIEVEMENTS_CHANGE;
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
 * A custom event.
 */
export interface EventCustom extends Omit<BaseEvent, 'type'> {
	/**
	 * Type of the event.
	 */
	type: EventType.CUSTOM;
	/**
	 * Content of the event.
	 */
	content: {
		/**
		 * Text to be displayed alongside event.
		 */
		text: string;
		/**
		 * FontAwesome icon to be shown in the event.
		 */
		icon: string;
		/**
		 * Steam ID of the member who is involved in the event.
		 */
		memberId: string;
	};
}
