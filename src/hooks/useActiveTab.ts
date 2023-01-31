import { useEffect } from 'react';

import { useAppContext } from 'context';
import { TabDict } from 'configuration/tabs';
import { useMixpanel } from 'hooks';

export const useActiveTab = (tab: TabDict) => {
	const { setActiveTab } = useAppContext();
	const { track } = useMixpanel();

	useEffect(() => {
		setActiveTab(tab);
		track(`tab.${tab}.load`);
	}, []);
};
