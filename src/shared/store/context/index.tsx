import React, { useState } from 'react';

type ContextType = {
  loggedIn: boolean;
};

export const AppContext = React.createContext({} as ContextType);

const AppContextProvider = ({ children }: { children: any }): JSX.Element => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  const value = {
    loggedIn,
    setLoggedIn,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
