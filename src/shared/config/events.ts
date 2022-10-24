import { EventType } from '@masochistme/sdk/dist/v1/types';

export type EventDict = {
	type: EventType;
	icon: string;
	description: string;
};

export const EventsDict: EventDict[] = [
	{
		icon: 'fas fa-user-plus',
		description: 'new member joining the community',
		type: EventType.MEMBER_JOIN,
	},
	{
		icon: 'fas fa-user-minus',
		description: 'member leaving the community',
		type: EventType.MEMBER_LEAVE,
	},
	{
		icon: 'fas fa-check-square',
		description: 'member completing a curated game',
		type: EventType.COMPLETE,
	},
	{
		icon: 'fas fa-plus-square',
		description: 'new game being curated',
		type: EventType.GAME_ADD,
	},
	{
		icon: 'fas fa-minus-square',
		description: 'game being removed from curator',
		type: EventType.GAME_REMOVE,
	},
	{
		icon: 'fas fa-bolt',
		description: 'game changing its tier',
		type: EventType.GAME_TIER_CHANGE,
	},
	{
		icon: 'fas fa-award',
		description: 'game getting a new badge',
		type: EventType.BADGE_CREATE,
	},
	{
		icon: 'fas fa-medal',
		description: 'member earning a new badge',
		type: EventType.BADGE_GET,
	},
	{
		icon: 'fas fa-tasks',
		description: 'game having achievements added or removed',
		type: EventType.ACHIEVEMENTS_CHANGE,
	},
	{
		icon: 'fas fa-heart',
		description: 'custom event',
		type: EventType.CUSTOM,
	},
];
