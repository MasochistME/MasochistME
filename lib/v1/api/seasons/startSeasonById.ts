import axios, { AxiosResponse } from 'axios';
import { UpdateResult } from 'mongodb';

import { ResponseError } from 'v1/types';

/**
 * Starts a new season. User must pass an ID of an already created race.
 *
 * @category Seasons
 */
export const startSeasonById = async (
	{ seasonId }: { seasonId: string },
	BASE_URL: string,
): Promise<UpdateResult> => {
	const url = `${BASE_URL}/seasons/season/${seasonId}`;

	const seasonResponse = await axios.post<
		UpdateResult | ResponseError,
		AxiosResponse<UpdateResult | ResponseError>
	>(url, {}, { validateStatus: () => true });

	const { status, data } = seasonResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as UpdateResult;
};
