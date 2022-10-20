import { useQuery } from '@tanstack/react-query';
import { useAppContext } from 'shared/store/context';

import { EventsListParams } from '@masochistme/sdk/dist/v1/api/events';

/**
 *
 * @param limit
 * @returns
 */
export const useEvents = (params?: EventsListParams) => {
	const { sdk } = useAppContext();

	const {
		data: eventsData = [],
		isLoading,
		isFetched,
		isError,
	} = useQuery(['masochist', 'events', JSON.stringify(params)], () =>
		sdk.getEventsList({ ...(params ?? {}) }),
	);

	return { eventsData, isLoading, isFetched, isError };
};
