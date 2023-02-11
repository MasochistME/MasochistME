import axios, { AxiosResponse } from 'axios';
import { InsertOneResult } from 'mongodb';

import { Log, ResponseError } from 'v1/types';

/**
 * Creates a new log.
 *
 * ## Usage
 *
 * ```ts
 * const log: Omit<LogComplete, '_id'> = {
 * 	type: LogType.COMPLETE,
 *  memberId: "453627890348576",
 *  gameId: 56780,
 * };
 *
 * const {
 * 	acknowledged,
 * 	insertedId,
 * } = await sdk.createLog({ log });
 * ```
 *
 * @param params.log - Data of the new log. Only the fields from base Log type are required, and the rest depends on the log type.
 */
export const createLog = async (
	params: { log: Omit<Log, '_id'> },
	/** @ignore */
	BASE_URL: string,
): Promise<InsertOneResult<Log>> => {
	const { log } = params;
	const url = `${BASE_URL}/logs`; // TODO Create this endpoint

	const logResponse = await axios.post<
		InsertOneResult<Log> | ResponseError,
		AxiosResponse<InsertOneResult<Log> | ResponseError>,
		Omit<Log, '_id'>
	>(url, log, { validateStatus: () => true });

	const { status, data } = logResponse;

	if (status !== 201) throw new Error((data as ResponseError).error);
	return data as InsertOneResult<Log>;
};
