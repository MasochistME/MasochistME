import { useAppContext } from 'shared/store/context';
import { TabDict } from 'shared/config/tabs';
import { useEffect } from 'react';

export const useActiveTab = (tab: TabDict) => {
	const { setActiveTab } = useAppContext();

	useEffect(() => {
		setActiveTab(tab);
	}, []);
};
