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
		sdk.getFeaturedList({ filter: { from: lastWeekDate } }),
	);

	return { featuredData, isLoading, isFetched, isError };
};
