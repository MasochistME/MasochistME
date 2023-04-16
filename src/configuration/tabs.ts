import { IconType } from 'components';

export enum TabDict {
	HOME = 'home',
	LEADERBOARDS = 'leaderboards',
	GAME = 'game',
	GAMES = 'games',
	EVENTS = 'events',
	PROFILE = 'profile',
	HISTORY = 'history',
	BADGES = 'badges',
	SUPPORT = 'support',
	JOIN = 'join',
	CHANGELOG = 'changelog',
}

export type Tab = {
	id: TabDict;
	text: string;
	icon: IconType;
	link: string;
	visible: boolean;
	external: boolean;
};

export const tabs: Tab[] = [
	{
		id: TabDict.HOME,
		text: 'home',
		icon: 'Home',
		link: '',
		visible: true,
		external: false,
	},
	{
		id: TabDict.LEADERBOARDS,
		text: 'leaderboards',
		icon: 'Medal',
		link: 'leaderboards',
		visible: true,
		external: false,
	},
	{
		id: TabDict.GAMES,
		text: 'game list',
		icon: 'Gamepad',
		link: 'games',
		visible: true,
		external: false,
	},
	{
		id: TabDict.BADGES,
		text: 'badges',
		icon: 'Badge',
		link: 'badges',
		visible: true,
		external: false,
	},
	{
		id: TabDict.EVENTS,
		text: 'events',
		icon: 'Finish',
		link: 'events',
		visible: true,
		external: false,
	},
	{
		id: TabDict.HISTORY,
		text: 'history',
		icon: 'History',
		link: 'history',
		visible: true,
		external: false,
	},
	{
		id: TabDict.SUPPORT,
		text: 'support',
		icon: 'Heart',
		link: 'support',
		visible: true,
		external: false,
	},
	// NOT INCLUDED IN THE NAVIGATION BAR
	{
		id: TabDict.PROFILE,
		text: 'profile',
		icon: 'IDCard',
		link: 'profile',
		visible: false,
		external: false,
	},
	{
		id: TabDict.GAME,
		text: 'game',
		icon: 'Puzzle',
		link: 'game',
		visible: false,
		external: false,
	},
	{
		id: TabDict.JOIN,
		text: 'How to join',
		icon: 'DoorOpen',
		link: 'join',
		visible: false,
		external: false,
	},
	{
		id: TabDict.CHANGELOG,
		text: 'Changelog',
		icon: 'Checklist',
		link: 'changelog',
		visible: false,
		external: false,
	},
];
