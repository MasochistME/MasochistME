import axios, { AxiosResponse } from 'axios';
import { InsertOneResult } from 'mongodb';

import { Season, ResponseError } from 'v1/types';

/**
 * Creates a new season.
 *
 * @category Seasons
 */
export const createSeason = async (
	{ season }: { season: Omit<Season, '_id'> },
	BASE_URL: string,
): Promise<InsertOneResult<Season>> => {
	const url = `${BASE_URL}/seasons`;

	const seasonResponse = await axios.post<
		InsertOneResult<Season> | ResponseError,
		AxiosResponse<InsertOneResult<Season> | ResponseError>,
		Omit<Season, '_id'>
	>(url, season, { validateStatus: () => true });

	const { status, data } = seasonResponse;

	if (status !== 201) throw new Error((data as ResponseError).error);
	return data as InsertOneResult<Season>;
};
