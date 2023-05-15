import { WithId } from 'mongodb';

export enum EventType {
	COMPLETE = 'complete',
	MEMBER_JOIN = 'memberJoined',
	MEMBER_LEAVE = 'memberLeft',
	GAME_TIER_CHANGE = 'tierChange',
	GAME_ADD = 'newGame',
	GAME_REMOVE = 'gameRemoved',
	BADGE_CREATE = 'badgeAdded',
	BADGE_GET = 'badgeGiven',
}

/**
 * Base event.
 */
export type Event = WithId<{
	date: number; // A date in a timestamp format.
	type: keyof typeof EventType;
}>;

/**
 * Event generated when Masochist.ME member completes a curated game.
 */
export interface EventComplete extends Omit<Event, 'type'> {
	type: EventType.COMPLETE;
	member: string;
	game: string;
}

/**
 * Event generated when a new member joins Masochist.ME Steam curator.
 */
export interface EventMemberJoin extends Omit<Event, 'type'> {
	type: EventType.MEMBER_JOIN;
	member: string;
}

/**
 * Event generated when a Masochist.ME member leaves the Steam curator.
 */
export interface EventMemberLeave extends Omit<Event, 'type'> {
	type: EventType.MEMBER_LEAVE;
	member: string;
}

/**
 * Event generated when a Masochist.ME curated game changes its tier.
 */
export interface EventGameTierChange extends Omit<Event, 'type'> {
	type: EventType.GAME_TIER_CHANGE;
	game: string | number;
	oldTier: string | number;
	newTier: string | number;
}

/**
 * Event generated when a new Steam game gets curated by the Masochist.ME curator.
 */
export interface EventGameAdd extends Omit<Event, 'type'> {
	type: EventType.GAME_ADD;
	game: string;
}

/**
 * Event generated when a Steam game gets removed from the Masochist.ME curator.
 */
export interface EventGameRemove extends Omit<Event, 'type'> {
	type: EventType.GAME_REMOVE;
	game: string;
}

/**
 * Event generated when a new Masochist.ME badge is created.
 */
export interface EventBadgeCreate extends Omit<Event, 'type'> {
	type: EventType.BADGE_CREATE;
	badge: string;
	game: string;
}

/** Event generated when a Masochist.ME member gets assigned a badge. */
export interface EventBadgeGet extends Omit<Event, 'type'> {
	type: EventType.BADGE_GET;
	badge: string;
	member: string;
}
