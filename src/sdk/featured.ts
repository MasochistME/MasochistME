import { FeaturedListParams } from '@masochistme/sdk/dist/v1/api/featured';
import { useQuery } from '@tanstack/react-query';
import { useAppContext } from 'context';

/**
 *
 */
export const useFeatured = () => {
	const { sdk } = useAppContext();
	const weekTimestamp = 1000 * 60 * 60 * 24 * 7;
	const lastWeekDate = new Date(Date.now() - weekTimestamp);

	const {
		data: featuredData = [],
		isLoading,
		isFetched,
		isError,
	} = useQuery(['masochist', 'featured', 'lastweek'], () =>
		sdk.getFeaturedList({
			filter: { from: lastWeekDate, isApproved: true, isVisible: true },
			sort: { date: 'desc' },
		}),
	);

	return { featuredData, isLoading, isFetched, isError };
};

/**
 *
 */
export const useFeaturedFiltered = (params?: FeaturedListParams) => {
	const { sdk } = useAppContext();

	const {
		data: featuredData = [],
		isLoading,
		isFetched,
		isError,
	} = useQuery(
		['masochist', 'featured', params ? JSON.stringify(params) : ''],
		() => sdk.getFeaturedList({ ...(params ?? {}) }),
	);

	return { featuredData, isLoading, isFetched, isError };
};
