import { TabDict } from 'configuration/tabs';
import { useAppContext } from 'context';
import { useEffect } from 'react';

export const useActiveTab = (tab: TabDict) => {
  const { setActiveTab } = useAppContext();

  useEffect(() => {
    setActiveTab(tab);
  }, []);
};
