import { useQuery } from '@tanstack/react-query';
import { useAppContext } from 'shared/store/context';

/**
 *
 * @param limit
 * @returns
 */
export const useEvents = (limit?: number) => {
	const { sdk } = useAppContext();

	const {
		data: eventsData = [],
		isLoading,
		isFetched,
		isError,
	} = useQuery(['masochist', 'events', `limit-${limit ?? 'none'}`], () =>
		sdk.getEventsList({ sort: { date: 'desc' }, ...(limit && { limit }) }),
	);

	return { eventsData, isLoading, isFetched, isError };
};
