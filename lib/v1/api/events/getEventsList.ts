import axios, { AxiosResponse } from 'axios';

import { Event, Sort, ResponseError } from 'v1/types';

/**
 * Returns a list of all events.
 *
 * ### Sort options
 *
 * - `date` - sorts by date of event.
 *
 * ## Usage
 *
 * ```ts
 * const eventsAll: Event[] = await sdk.getEventsList({ });
 * const eventsNewest: Event[] = await sdk.getEventsList({ sort: { date: 'desc' }});
 * const eventsComplete: Event[] = await sdk.getEventsList({ filter: { type: EventType.COMPLETE }});
 * ```
 *
 * @param params.filter - Filter to apply to returned events list.
 * @param params.sort - Fields to sort event list by.
 * @param params.limit - Limit how many events you want to have returned (sorted from newest).
 */
export const getEventsList = async (
	params: {
		filter?: Partial<Event>;
		sort?: {
			[key in keyof Partial<Pick<Event, 'date'>>]: Sort;
		};
		limit?: number;
	},
	/** @ignore */
	BASE_URL: string,
): Promise<Event[]> => {
	const { filter, sort, limit } = params;
	const url = `${BASE_URL}/events/list`;

	const eventResponse = await axios.post<
		Event[] | ResponseError,
		AxiosResponse<Event[] | ResponseError>
	>(url, { filter, sort, limit }, { validateStatus: () => true });

	const { status, data } = eventResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as Event[];
};
