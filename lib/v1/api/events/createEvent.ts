import axios, { AxiosResponse } from 'axios';
import { InsertOneResult } from 'mongodb';

import { Event, ResponseError } from 'v1/types';

/**
 * Creates a new event.
 *
 * ## Usage
 *
 * ```ts
 * const event: Omit<EventComplete, '_id'> = {
 * 	type: EventType.COMPLETE,
 *  memberId: "453627890348576",
 *  gameId: 56780,
 * };
 *
 * const {
 * 	acknowledged,
 * 	insertedId,
 * } = await sdk.createEvent({ event });
 * ```
 *
 * @param params.event - Data of the new event. Only the fields from base Event type are required, and the rest depends on the event type.
 */
export const createEvent = async (
	params: { event: Omit<Event, '_id'> },
	/** @ignore */
	BASE_URL: string,
): Promise<InsertOneResult<Event>> => {
	const { event } = params;
	const url = `${BASE_URL}/events`; // TODO Create this endpoint

	const eventResponse = await axios.post<
		InsertOneResult<Event> | ResponseError,
		AxiosResponse<InsertOneResult<Event> | ResponseError>,
		Omit<Event, '_id'>
	>(url, event, { validateStatus: () => true });

	const { status, data } = eventResponse;

	if (status !== 201) throw new Error((data as ResponseError).error);
	return data as InsertOneResult<Event>;
};
