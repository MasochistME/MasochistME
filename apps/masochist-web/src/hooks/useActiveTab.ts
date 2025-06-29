import { useEffect } from 'react';

import { useAppContext } from 'context';
import { TabDict } from 'configuration/tabs';

export const useActiveTab = (tab: TabDict) => {
  const { setActiveTab } = useAppContext();

  useEffect(() => {
    setActiveTab(tab);
  }, []);
};
