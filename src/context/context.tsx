import React, { useContext, useState } from 'react';
import { SDK } from '@masochistme/sdk/dist/v1/sdk';
import { TierId, LogType } from '@masochistme/sdk/dist/v1/types';

import { TabDict } from 'configuration/tabs';
import { LogDictionary } from 'configuration/logs';

import { Theme } from 'styles';
import { GameView, BadgeView } from 'hooks';
import { TimePeriod } from 'utils/getTimePeriod';

import config from 'config.json';

type ContextType = {
	// DEV
	dev: number;
	setDev: (dev: number) => void;
	sdk: SDK;
	path: string;

	// REST
	_activeTheme: Theme;
	_setActiveTheme: (activeTheme: Theme) => void;

	activeTab: TabDict;
	setActiveTab: (activeTab: TabDict) => void;
	visibleTiers: TierId[];
	setVisibleTiers: (visibleTiers: TierId[]) => void;
	visiblePrices: number[];
	setVisiblePrices: (visiblePrices: number[]) => void;
	visibleLogs: LogType[];
	setVisibleLogs: (visibleEvents: LogType[]) => void;

	_gameListView: GameView;
	_setGameListView: (gameListView: GameView) => void;
	_badgeListView: BadgeView;
	_setBadgeListView: (badgeListView: BadgeView) => void;

	queryGame: string;
	setQueryGame: (queryGame: string) => void;
	queryMember: string;
	setQueryMember: (queryMember: string) => void;
	queryLeaderboardPeriod: TimePeriod;
	setQueryLeaderboardPeriod: (queryLeaderboardPeriod: TimePeriod) => void;
};

export const AppContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element => {
	// DEV
	const [dev, setDev] = useState<number>(0);

	// REST
	const [activeTab, setActiveTab] = useState<TabDict>(TabDict.HOME);
	const [_activeTheme, _setActiveTheme] = useState<Theme>(Theme.ASH);
	const [_gameListView, _setGameListView] = useState<GameView>(GameView.TILE);
	const [_badgeListView, _setBadgeListView] = useState<BadgeView>(
		BadgeView.TILE,
	);

	const [queryGame, setQueryGame] = useState<string>('');
	const [queryMember, setQueryMember] = useState<string>('');
	const [queryLeaderboardPeriod, setQueryLeaderboardPeriod] =
		useState<TimePeriod>(TimePeriod.ALL);

	const [visibleTiers, setVisibleTiers] = useState<TierId[]>([]);
	const [visibleLogs, setVisibleLogs] = useState<LogType[]>(
		LogDictionary.map(e => e.type),
	);
	const [visiblePrices, setVisiblePrices] = useState<number[]>([0, 1000]);

	const path = config.API;
	const sdk = new SDK({
		host: config.API,
		authToken: 'masochist',
	});

	const value = {
		// DEV
		dev,
		setDev,
		path,
		sdk,

		_activeTheme,
		_setActiveTheme,

		activeTab,
		setActiveTab,
		visibleTiers,
		setVisibleTiers,
		visiblePrices,
		setVisiblePrices,
		visibleLogs,
		setVisibleLogs,

		_gameListView,
		_setGameListView,
		_badgeListView,
		_setBadgeListView,

		queryGame,
		setQueryGame,
		queryMember,
		setQueryMember,
		queryLeaderboardPeriod,
		setQueryLeaderboardPeriod,
	};

	return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const AppContext = React.createContext({} as ContextType);
export const useAppContext = (): ContextType => useContext(AppContext);
