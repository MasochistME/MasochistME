import axios, { AxiosResponse } from 'axios';
import { UpdateResult } from 'mongodb';

import { Season, ResponseError } from 'v1/types';

/**
 * Updates a season by updating the fields that the user had passed.
 * @param seasonId string
 * @param season Partial<Omit<Season, '_id'>>
 * @returns UpdateResult
 */
export const updateSeasonById = async (
	{
		seasonId,
		season,
	}: { seasonId: string; season: Partial<Omit<Season, '_id'>> },
	BASE_URL: string,
): Promise<UpdateResult> => {
	const url = `${BASE_URL}/seasons/season/${seasonId}`;

	const seasonResponse = await axios.put<
		UpdateResult | ResponseError,
		AxiosResponse<UpdateResult | ResponseError>,
		Partial<Omit<Season, '_id'>>
	>(url, season, { validateStatus: () => true });

	const { status, data } = seasonResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as UpdateResult;
};
