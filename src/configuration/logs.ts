import { LogType } from '@masochistme/sdk/dist/v1/types';
import { IconType } from 'components';

export type SingleLog = {
	type: LogType;
	icon: IconType;
	description: string;
};

export const LogDictionary: SingleLog[] = [
	{
		icon: 'UserPlus',
		description: 'new member joining the community',
		type: LogType.MEMBER_JOIN,
	},
	{
		icon: 'UserMinus',
		description: 'member leaving the community',
		type: LogType.MEMBER_LEAVE,
	},
	{
		icon: 'SquareCheck',
		description: 'member completing a curated game',
		type: LogType.COMPLETE,
	},
	{
		icon: 'SquarePlus',
		description: 'new game being curated',
		type: LogType.GAME_ADD,
	},
	{
		icon: 'SquareMinus',
		description: 'game being removed from curator',
		type: LogType.GAME_REMOVE,
	},
	{
		icon: 'Bolt',
		description: 'game changing its tier',
		type: LogType.GAME_TIER_CHANGE,
	},
	{
		icon: 'Badge',
		description: 'game getting a new badge',
		type: LogType.BADGE_CREATE,
	},
	{
		icon: 'Medal',
		description: 'member earning a new badge',
		type: LogType.BADGE_GET,
	},
	{
		icon: 'Checklist',
		description: 'game having achievements added or removed',
		type: LogType.ACHIEVEMENTS_CHANGE,
	},
	{
		icon: 'Heart',
		description: 'custom event',
		type: LogType.CUSTOM,
	},
];
