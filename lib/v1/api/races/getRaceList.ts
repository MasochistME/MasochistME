import axios, { AxiosResponse } from 'axios';

import { Race, RaceWithSummary, Sort, ResponseError } from 'v1/types';

/**
 * Returns a list of all races.
 *
 * ### Filter options
 *
 * - `type` - filters by race type,
 * - `season` - filters by race season.
 *
 * ### Sort options
 *
 * - `startDate` - sorts by race starting date,
 * - `endDate` - sorts by race ending date,
 * - `season` - sorts races by season.
 *
 * ## Usage
 *
 * ```ts
 * const racesAll: Race[] = await sdk.getRaceList({ });
 * const racesNewest: Race[] = await sdk.getRaceList({ sort: { startDate: 'desc' }});
 * const racesSeasonThree: Race[] = await sdk.getRaceList({ filter: { season: '5afe4378dde74c68 }});
 * ```
 *
 * @param params.filter - Filter to apply to returned race list.
 * @param params.sort - Fields to sort race list by.
 * @param params.limit - How many races will get returned.
 * ```
 *
 */
export const getRaceList = async (
	params: RaceListParams,
	/** @ignore */
	BASE_URL: string,
): Promise<RaceWithSummary[]> => {
	const { filter, sort, limit } = params;
	const url = `${BASE_URL}/races/list`;

	const raceResponse = await axios.post<
		Race[] | ResponseError,
		AxiosResponse<Race[] | ResponseError>
	>(url, { filter, sort, limit }, { validateStatus: () => true });

	const { status, data } = raceResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as RaceWithSummary[];
};

export type RaceListParams = {
	filter?: Partial<Pick<Race, 'type' | 'season' | 'isDone' | 'isActive'>>;
	sort?: {
		[key in keyof Partial<
			Pick<Race, 'startDate' | 'endDate' | 'season'>
		>]: Sort;
	};
	limit?: number;
};
