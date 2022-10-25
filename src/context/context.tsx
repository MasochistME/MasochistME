import React, { useContext, useState, useMemo } from 'react';
import { SDK } from '@masochistme/sdk/dist/v1/sdk';
import { TierId, EventType } from '@masochistme/sdk/dist/v1/types';

import { TabDict } from 'shared/config/tabs';
import { EventsDict } from 'shared/config/events';

import config from 'config.json';

import { colors, ColorTokens, Theme } from 'styles/colors';

export enum GameView {
	TILE = 'tiles',
	TABLE = 'table',
}

type ContextType = {
	sdk: SDK;
	path: string;

	activeTheme: Theme;
	setActiveTheme: (activeTheme: Theme) => void;
	colorTokens: ColorTokens;

	activeTab: TabDict;
	setActiveTab: (activeTab: TabDict) => void;
	gameListView: GameView;
	setGameListView: (gameListView: GameView) => void;
	visibleTiers: TierId[];
	setVisibleTiers: (visibleTiers: TierId[]) => void;
	visibleEvents: EventType[];
	setVisibleEvents: (visibleEvents: EventType[]) => void;

	queryGame: string;
	setQueryGame: (queryGame: string) => void;
	queryMember: string;
	setQueryMember: (queryMember: string) => void;
};

export const AppContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element => {
	const [activeTheme, setActiveTheme] = useState<Theme>(Theme.ASH);
	const [activeTab, setActiveTab] = useState<TabDict>(TabDict.HOME);
	const [gameListView, setGameListView] = useState<GameView>(GameView.TILE);
	const [visibleTiers, setVisibleTiers] = useState<TierId[]>([]);
	const [visibleEvents, setVisibleEvents] = useState<EventType[]>(
		EventsDict.map(e => e.type),
	);
	const [queryGame, setQueryGame] = useState<string>('');
	const [queryMember, setQueryMember] = useState<string>('');

	const colorTokens = useMemo(() => {
		return colors[activeTheme];
	}, [activeTheme]);

	const path = config.API;
	const sdk = new SDK({
		host: config.API,
		authToken: 'masochist',
	});

	const value = {
		path,
		sdk,

		activeTheme,
		setActiveTheme,
		colorTokens,

		activeTab,
		setActiveTab,
		gameListView,
		setGameListView,
		visibleTiers,
		setVisibleTiers,
		visibleEvents,
		setVisibleEvents,

		queryGame,
		setQueryGame,
		queryMember,
		setQueryMember,
	};

	return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const AppContext = React.createContext({} as ContextType);
export const useAppContext = (): ContextType => useContext(AppContext);
