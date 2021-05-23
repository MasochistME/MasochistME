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
  const isDev = window.location.hostname === 'localhost';
  const path = isDev ? 'http://localhost:3002' : 'http://89.47.165.141:3002';
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('UNKNOWN ENTITY');

  const search = window.location.search;
  const params = new URLSearchParams(search);

  console.log(params);

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
