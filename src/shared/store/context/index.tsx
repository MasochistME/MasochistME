import React, { useState } from 'react';

type ContextType = {
  path: string;
  loggedIn: boolean;
  setLoggedIn: (loggedIn: boolean) => void;
  username: string;
  setUsername: (username: string) => void;
};

const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const path = 'http://89.47.165.141:3002';
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('UNKNOWN ENTITY');

  const value = {
    loggedIn,
    setLoggedIn,
    username,
    setUsername,
    path,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const AppContext = React.createContext({} as ContextType);
export default AppContextProvider;
