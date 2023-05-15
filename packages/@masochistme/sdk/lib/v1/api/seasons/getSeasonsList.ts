import axios, { AxiosResponse } from 'axios';

import { Season, Sort, ResponseError } from 'v1/types';

/**
 * Returns a list of all seasons.
 *
 * ### Filter options
 *
 * - `finished` - filter by seasons which have start and end date,
 * - `active` - filter by seasons which have start date but did not yet finish,
 * - `inactive` - filter by seasons which do not have start date,
 * - `unfinished` - filter by seasons which do not have end date,
 *
 * ### Sort options
 *
 * - `startDate` - sorts by season starting date,
 * - `endDate` - sorts by season ending date.
 *
 * ## Usage
 *
 * ```ts
 * const seasonsAll: Season[] = await sdk.getSeasonsList();
 * const seasonsFinished: Season[] = await sdk.getSeasonsList({ finished: true });
 * const seasonsInactive: Season[] = await sdk.getSeasonsList({ inactive: true });
 * ```
 *
 * @param params.filter - Filter to apply to returned races list.
 * @param params.filter.inactive - Get only seasons which are yet to start.
 * @param params.filter.active - Get only currently active seasons.
 * @param params.filter.finished - Get only past seasons.
 * @param params.filter.unfinished - Get only seasons which are not finished.
 * @param params.sort - Fields to sort season list by.
 * @param params.limit - How many seasons will get returned.
 */
export const getSeasonsList = async (
	params: SeasonsListParams,
	/** @ignore */
	BASE_URL: string,
): Promise<Season[]> => {
	const { filter, sort, limit } = params;
	const url = `${BASE_URL}/seasons/list`;

	const seasonResponse = await axios.post<
		Season[] | ResponseError,
		AxiosResponse<Season[] | ResponseError>
	>(url, { filter, sort, limit }, { validateStatus: () => true });

	const { status, data } = seasonResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as Season[];
};

export type SeasonsListParams = {
	filter?: {
		finished?: boolean;
		active?: boolean;
		inactive?: boolean;
		unfinished?: boolean;
	};
	sort?: {
		[key in keyof Partial<Pick<Season, 'startDate' | 'endDate'>>]: Sort;
	};
	limit?: number;
};
