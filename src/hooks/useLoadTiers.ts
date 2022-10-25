import { useEffect } from 'react';
import { useTiers } from 'sdk';
import { useAppContext } from 'context';

export const useLoadTiers = () => {
	const { setVisibleTiers } = useAppContext();
	const { tiersData, isFetched } = useTiers();

	useEffect(() => {
		if (isFetched) {
			const allTiers = tiersData.map(tier => tier.id);
			setVisibleTiers(allTiers);
		}
	}, [isFetched]);

	return { isFetched };
};
