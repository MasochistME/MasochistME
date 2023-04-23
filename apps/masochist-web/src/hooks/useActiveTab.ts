import { useEffect } from 'react';

import { useAppContext } from 'context';
import { TabDict } from 'configuration/tabs';
import { useMixpanel } from 'hooks';

export const useActiveTab = (tab: TabDict, disableTrack = false) => {
	const { setActiveTab } = useAppContext();
	const { track } = useMixpanel();

	useEffect(() => {
		setActiveTab(tab);
		if (!disableTrack) track(`tab.${tab}.load`);
	}, []);
};
