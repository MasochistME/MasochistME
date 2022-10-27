import { EventType } from '@masochistme/sdk/dist/v1/types';
import { IconType } from 'components';

export type EventDict = {
	type: EventType;
	icon: IconType;
	description: string;
};

export const EventsDict: EventDict[] = [
	{
		icon: 'UserPlus',
		description: 'new member joining the community',
		type: EventType.MEMBER_JOIN,
	},
	{
		icon: 'UserMinus',
		description: 'member leaving the community',
		type: EventType.MEMBER_LEAVE,
	},
	{
		icon: 'SquareCheck',
		description: 'member completing a curated game',
		type: EventType.COMPLETE,
	},
	{
		icon: 'SquarePlus',
		description: 'new game being curated',
		type: EventType.GAME_ADD,
	},
	{
		icon: 'SquareMinus',
		description: 'game being removed from curator',
		type: EventType.GAME_REMOVE,
	},
	{
		icon: 'Bolt',
		description: 'game changing its tier',
		type: EventType.GAME_TIER_CHANGE,
	},
	{
		icon: 'Badge',
		description: 'game getting a new badge',
		type: EventType.BADGE_CREATE,
	},
	{
		icon: 'Medal',
		description: 'member earning a new badge',
		type: EventType.BADGE_GET,
	},
	{
		icon: 'Checklist',
		description: 'game having achievements added or removed',
		type: EventType.ACHIEVEMENTS_CHANGE,
	},
	{
		icon: 'Heart',
		description: 'custom event',
		type: EventType.CUSTOM,
	},
];
