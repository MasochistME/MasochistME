import { LogType } from '@masochistme/sdk/dist/v1/types';
import { IconType } from 'components';
import { LocaleKey } from 'i18n';

export type SingleLog = {
	type: LogType;
	icon: IconType;
	description: LocaleKey;
};

export const LogDictionary: SingleLog[] = [
	{
		icon: 'UserPlus',
		description: `history.log.description.${LogType.MEMBER_JOIN}`,
		type: LogType.MEMBER_JOIN,
	},
	{
		icon: 'UserMinus',
		description: `history.log.description.${LogType.MEMBER_LEAVE}`,
		type: LogType.MEMBER_LEAVE,
	},
	{
		icon: 'SquareCheck',
		description: `history.log.description.${LogType.COMPLETE}`,
		type: LogType.COMPLETE,
	},
	{
		icon: 'SquarePlus',
		description: `history.log.description.${LogType.GAME_ADD}`,
		type: LogType.GAME_ADD,
	},
	{
		icon: 'SquareMinus',
		description: `history.log.description.${LogType.GAME_REMOVE}`,
		type: LogType.GAME_REMOVE,
	},
	{
		icon: 'Bolt',
		description: `history.log.description.${LogType.GAME_TIER_CHANGE}`,
		type: LogType.GAME_TIER_CHANGE,
	},
	{
		icon: 'Badge',
		description: `history.log.description.${LogType.BADGE_CREATE}`,
		type: LogType.BADGE_CREATE,
	},
	{
		icon: 'Medal',
		description: `history.log.description.${LogType.BADGE_GET}`,
		type: LogType.BADGE_GET,
	},
	{
		icon: 'Checklist',
		description: `history.log.description.${LogType.ACHIEVEMENTS_CHANGE}`,
		type: LogType.ACHIEVEMENTS_CHANGE,
	},
	{
		icon: 'Heart',
		description: `history.log.description.${LogType.CUSTOM}`,
		type: LogType.CUSTOM,
	},
];
