import React, { useContext, useState } from 'react';
import { SDK } from '@masochistme/sdk/dist/v1/sdk';

import { TabDict } from 'shared/config/tabs';
import config from 'config.json';

type ContextType = {
	sdk: SDK;
	path: string;
	activeTab: TabDict;
	setActiveTab: (activeTab: TabDict) => void;
};

export const AppContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element => {
	const [activeTab, setActiveTab] = useState<TabDict>(TabDict.HOME);

	const path = config.API;
	const sdk = new SDK({
		host: config.API,
		authToken: config.ACCESS_TOKEN,
	});

	const value = {
		path,
		sdk,
		activeTab,
		setActiveTab,
	};

	return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const AppContext = React.createContext({} as ContextType);
export const useAppContext = (): ContextType => useContext(AppContext);
