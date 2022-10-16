import React from 'react';

import config from 'config.json';

type ContextType = {
	path: string;
};

const AppContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element => {
	const path = config.API;

	const value = {
		path,
	};

	return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const AppContext = React.createContext({} as ContextType);
export default AppContextProvider;
