import axios, { AxiosResponse } from 'axios';

import { Event, EventType, ResponseError } from 'v1/types';

/**
 * Returns a list of all events.
 *
 * ### Filter options
 *
 * - `type` - return only events of a specific type,
 * - `memberId` - return only events related to a specific member.
 *
 * ## Usage
 *
 * ```ts
 * const eventsAll: Event[] = await sdk.getEventsList({ filter: {} });
 * const eventsNewest: Event[] = await sdk.getEventsList({ filter: {}, limit: 100 });
 * const eventsComplete: Event[] = await sdk.getEventsList({ filter: { type: EventType.COMPLETE }});
 * ```
 *
 * @param params.filter - Filter to apply to returned events list.
 * @param params.filter.type - Get events of only particular type.
 * @param params.filter.memberId - Get events related to a specific member.
 * @param params.limit - Limit how many events you want to have returned (sorted from newest).
 */
export const getEventsList = async (
	params: {
		filter: {
			type?: EventType;
			memberId?: string;
		};
		limit?: number;
	},
	/** @ignore */
	BASE_URL: string,
): Promise<Event[]> => {
	const { filter } = params;
	const url = `${BASE_URL}/events/list`;

	const eventResponse = await axios.post<
		Event[] | ResponseError,
		AxiosResponse<Event[] | ResponseError>
	>(url, filter, { validateStatus: () => true });

	const { status, data } = eventResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as Event[];
};
