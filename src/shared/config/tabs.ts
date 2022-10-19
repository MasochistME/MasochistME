export enum TabDict {
	HOME = 'home',
	LEADERBOARDS = 'leaderboards',
	GAME = 'game',
	GAMES = 'games',
	EVENTS = 'events',
	PROFILE = 'profile',
	BADGES = 'badges',
	SUPPORT = 'support',
}

export type Tab = {
	id: TabDict;
	text: string;
	icon: string;
	link: string;
	visible: boolean;
	external: boolean;
};

export const tabs: Tab[] = [
	{
		id: TabDict.HOME,
		text: 'homepage',
		icon: 'fas fa-home',
		link: 'home',
		visible: true,
		external: false,
	},
	{
		id: TabDict.LEADERBOARDS,
		text: 'leaderboards',
		icon: 'fas fa-medal',
		link: 'leaderboards',
		visible: true,
		external: false,
	},
	{
		id: TabDict.GAMES,
		text: 'game list',
		icon: 'fas fa-gamepad',
		link: 'games',
		visible: true,
		external: false,
	},
	{
		id: TabDict.EVENTS,
		text: 'event log',
		icon: 'fas fa-history',
		link: 'events',
		visible: true,
		external: false,
	},
	{
		id: TabDict.PROFILE,
		text: 'profile',
		icon: 'fas fa-address-card',
		link: 'profile',
		visible: false,
		external: false,
	},
	{
		id: TabDict.GAME,
		text: 'game',
		icon: 'fas fa-puzzle-piece',
		link: 'game',
		visible: false,
		external: false,
	},
	{
		id: TabDict.BADGES,
		text: 'badges',
		icon: 'fas fa-ribbon',
		link: 'badges',
		visible: false,
		external: false,
	},
	{
		id: TabDict.SUPPORT,
		text: 'support',
		icon: 'fas fa-heart',
		link: 'support',
		visible: true,
		external: false,
	},
];
