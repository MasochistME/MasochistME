import axios, { AxiosResponse } from 'axios';
import { UpdateResult } from 'mongodb';

import { Season, ResponseError } from 'v1/types';

/**
 * Starts a new season. User must pass an ID of an already created race.
 * @param seasonId string
 * @returns UpdateResult
 */
export const startSeasonById = async (
	{ seasonId }: { seasonId: string },
	BASE_URL: string,
): Promise<UpdateResult> => {
	const url = `${BASE_URL}/seasons/season/${seasonId}`;

	const seasonResponse = await axios.post<
		UpdateResult | ResponseError,
		AxiosResponse<UpdateResult | ResponseError>,
		Pick<Season, 'startDate'>
	>(url, { startDate: new Date() }, { validateStatus: () => true });

	const { status, data } = seasonResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as UpdateResult;
};
