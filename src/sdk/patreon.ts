import { useQuery } from '@tanstack/react-query';
import { useAppContext } from 'context';

/**
 *
 */
export const usePatreonTiers = () => {
	const { sdk } = useAppContext();

	const {
		data: patreonTiersData = [],
		isLoading,
		isFetched,
		isError,
	} = useQuery(['masochist', 'patreon', 'tiers'], () =>
		sdk.getPatreonTierList(),
	);

	return { patreonTiersData, isLoading, isFetched, isError };
};

/**
 *
 */
export const usePatrons = () => {
	const { sdk } = useAppContext();

	const {
		data: patronsData = [],
		isLoading,
		isFetched,
		isError,
	} = useQuery(['masochist', 'patreon', 'patrons'], () =>
		sdk.getPatronsList({}),
	);

	return { patronsData, isLoading, isFetched, isError };
};
