import React, { useState } from 'react';
import { Permission } from './types';

type ContextType = {
	path: string;
	isLoggedIn: boolean;
	setIsLoggedIn: (loggedIn: boolean) => void;
	username: string;
	setUsername: (username: string) => void;
	userId: string | number | undefined;
	setUserId: (userId: string | number | undefined) => void;
	isAdmin: boolean;
	setIsAdmin: (isAdmin: boolean) => void;
	permissions: Permission[];
	setPermissions: (permissions: Permission[]) => void;
};

const AppContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element => {
	const path = process?.env?.REACT_APP_API ?? 'http://localhost:3002';
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
	const [isAdmin, setIsAdmin] = useState<boolean>(false);
	const [permissions, setPermissions] = useState<Permission[]>([]);
	const [username, setUsername] = useState<string>('UNKNOWN ENTITY');
	const [userId, setUserId] = useState<string | number | undefined>();

	const value = {
		isLoggedIn,
		setIsLoggedIn,
		username,
		setUsername,
		userId,
		setUserId,
		path,
		isAdmin,
		setIsAdmin,
		permissions,
		setPermissions,
	};

	return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const AppContext = React.createContext({} as ContextType);
export default AppContextProvider;
