import axios, { AxiosResponse } from 'axios';

import { Season, ResponseError } from 'v1/types';

/**
 * Returns a list of all seasons.
 *
 * ### Filter options
 *
 * - `finished` - return only finished seasons,
 * - `inactive` - return only seasons which are yet to start.
 *
 * ## Usage
 *
 * ```ts
 * const seasonsAll: Season[] = await sdk.getSeasonsList();
 * const seasonsFinished: Season[] = await sdk.getSeasonsList({ finished: true });
 * const seasonsInactive: Season[] = await sdk.getSeasonsList({ inactive: true });
 * ```
 *
 * @param params.filter - Filter to apply to races.
 * @param params.filter.inactive - Get only seasons which are yet to start.
 * @param params.filter.active - Get only seasons which are finished.
 * @param params.filter.finished - Get only seasons which are finished.
 */
export const getSeasonsList = async (
	params: {
		filter: { finished?: boolean; active?: boolean; inactive?: boolean };
	},
	/** @ignore */
	BASE_URL: string,
): Promise<Season[]> => {
	const { filter } = params;
	const url = `${BASE_URL}/seasons/list`;

	const seasonResponse = await axios.post<
		Season[] | ResponseError,
		AxiosResponse<Season[] | ResponseError>
	>(url, filter, { validateStatus: () => true });

	const { status, data } = seasonResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as Season[];
};
