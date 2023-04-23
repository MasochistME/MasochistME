import { useEffect } from 'react';
import { useTiers } from 'sdk';
import { useAppContext } from 'context';

export const useLoadTiers = () => {
	const { setVisibleTiers } = useAppContext();
	const { tiersData } = useTiers();

	useEffect(() => {
		const allTiers = tiersData.map(tier => tier.id);
		setVisibleTiers(allTiers);
	}, [tiersData]);
};
