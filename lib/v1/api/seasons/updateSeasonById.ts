import axios, { AxiosResponse } from 'axios';
import { UpdateResult } from 'mongodb';

import { Season, ResponseError } from 'v1/types';

/**
 * Updates a season by updating the fields that the user had passed.
 * @category Seasons
 * @param params.seasonId - ID of the season.
 * @param params.season   - fields that should be changed in a season, if it exists.
 */
export const updateSeasonById = async (
	params: {
		seasonId: string;
		season: Pick<Season, 'name' | 'description' | 'icon'>;
	},
	/** @ignore */
	BASE_URL: string,
): Promise<UpdateResult> => {
	const { seasonId, season } = params;
	const url = `${BASE_URL}/seasons/season/${seasonId}`;

	const seasonResponse = await axios.put<
		UpdateResult | ResponseError,
		AxiosResponse<UpdateResult | ResponseError>,
		Pick<Season, 'name' | 'description' | 'icon'>
	>(url, season, { validateStatus: () => true });

	const { status, data } = seasonResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as UpdateResult;
};
