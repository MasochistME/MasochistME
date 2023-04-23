import { LocaleKey } from 'i18n';
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
	text: LocaleKey;
	icon: IconType;
	link: string;
	visible: boolean;
	external: boolean;
};

export const tabs: Tab[] = [
	{
		id: TabDict.HOME,
		text: 'tabs.title.home',
		icon: 'Home',
		link: '',
		visible: true,
		external: false,
	},
	{
		id: TabDict.LEADERBOARDS,
		text: 'tabs.title.leaderboards',
		icon: 'Medal',
		link: 'leaderboards',
		visible: true,
		external: false,
	},
	{
		id: TabDict.GAMES,
		text: 'tabs.title.game_list',
		icon: 'Gamepad',
		link: 'games',
		visible: true,
		external: false,
	},
	{
		id: TabDict.BADGES,
		text: 'tabs.title.badges',
		icon: 'Badge',
		link: 'badges',
		visible: true,
		external: false,
	},
	{
		id: TabDict.EVENTS,
		text: 'tabs.title.events',
		icon: 'Finish',
		link: 'events',
		visible: true,
		external: false,
	},
	{
		id: TabDict.HISTORY,
		text: 'tabs.title.history',
		icon: 'History',
		link: 'history',
		visible: true,
		external: false,
	},
	{
		id: TabDict.SUPPORT,
		text: 'tabs.title.support',
		icon: 'Heart',
		link: 'support',
		visible: true,
		external: false,
	},
	// NOT INCLUDED IN THE NAVIGATION BAR
	{
		id: TabDict.PROFILE,
		text: 'tabs.title.profile',
		icon: 'IDCard',
		link: 'profile',
		visible: false,
		external: false,
	},
	{
		id: TabDict.GAME,
		text: 'tabs.title.game',
		icon: 'Puzzle',
		link: 'game',
		visible: false,
		external: false,
	},
	{
		id: TabDict.JOIN,
		text: 'tabs.title.how_to_join',
		icon: 'DoorOpen',
		link: 'join',
		visible: false,
		external: false,
	},
	{
		id: TabDict.CHANGELOG,
		text: 'tabs.title.changelog',
		icon: 'Checklist',
		link: 'changelog',
		visible: false,
		external: false,
	},
];
