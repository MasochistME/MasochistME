import { useQuery } from '@tanstack/react-query';
import { useAppContext } from 'context';

/**
 *
 */
export const useTiers = () => {
	const { sdk } = useAppContext();

	const {
		data: tiersData = [],
		isLoading,
		isFetched,
		isError,
	} = useQuery(['masochist', 'tiers'], () => sdk.getTiersList({}));

	return { tiersData, isLoading, isFetched, isError };
};
