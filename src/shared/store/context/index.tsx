import React, { useContext } from 'react';
import { SDK } from '@masochistme/sdk/dist/v1/sdk';

import config from 'config.json';

type ContextType = {
	sdk: SDK;
	path: string;
};

const AppContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element => {
	const path = config.API;
	const sdk = new SDK({
		host: config.API,
		authToken: config.ACCESS_TOKEN,
	});

	const value = {
		path,
		sdk,
	};

	return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const AppContext = React.createContext({} as ContextType);
export default AppContextProvider;
export const useAppContext = (): ContextType => useContext(AppContext);
