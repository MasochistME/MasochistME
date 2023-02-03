import { BadgesListParams } from '@masochistme/sdk/dist/v1/api/badges';
import { useQuery } from '@tanstack/react-query';
import { useAppContext } from 'context';

/**
 *
 * @returns
 */
export const useBadges = (params?: BadgesListParams) => {
	const { sdk } = useAppContext();

	const {
		data: badgesData = [],
		isLoading,
		isFetched,
		isError,
	} = useQuery(
		['masochist', 'badges', params ? JSON.stringify(params) : ''],
		() => sdk.getBadgesList({ ...(params ?? {}) }),
	);

	console.log(isLoading, 'isLoading');
	console.log(isFetched, 'isFetched');
	console.log(isError, 'isError');

	return { badgesData, isLoading, isFetched, isError };
};
