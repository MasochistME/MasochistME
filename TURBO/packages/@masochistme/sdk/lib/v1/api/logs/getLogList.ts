import axios, { AxiosResponse } from 'axios';

import { Log, Sort, ResponseError } from 'v1/types';

/**
 * Returns a list of all logs.
 *
 * ### Sort options
 *
 * - `date` - sorts by date of log.
 *
 * ## Usage
 *
 * ```ts
 * const logsAll: Log[] = await sdk.getLogList({ });
 * const logsNewest: Log[] = await sdk.getLogList({ sort: { date: 'desc' }});
 * const logsComplete: Log[] = await sdk.getLogList({ filter: { type: LogType.COMPLETE }});
 * ```
 *
 * @param params.filter - Filter to apply to returned log list.
 * @param params.sort - Fields to sort log list by.
 * @param params.limit - Limit how many logs you want to have returned (sorted from newest).
 */
export const getLogList = async (
	params: LogListParams,
	/** @ignore */
	BASE_URL: string,
): Promise<Log[]> => {
	const { filter, sort, limit } = params;
	const url = `${BASE_URL}/logs/list`;

	const logResponse = await axios.post<
		Log[] | ResponseError,
		AxiosResponse<Log[] | ResponseError>
	>(url, { filter, sort, limit }, { validateStatus: () => true });

	const { status, data } = logResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as Log[];
};

export type LogListParams = {
	filter?: Partial<Log>;
	sort?: {
		[key in keyof Partial<Pick<Log, 'date'>>]: Sort;
	};
	limit?: number;
};
