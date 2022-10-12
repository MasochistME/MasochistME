import axios, { AxiosResponse } from 'axios';
import { DeleteResult } from 'mongodb';

import { ResponseError } from 'v1/types';

/**
 * Deletes a race.
 * @param raceId string
 * @returns DeleteResult
 */
export const deleteRaceById = async (
	{ raceId }: { raceId: string },
	BASE_URL: string,
): Promise<DeleteResult> => {
	const url = `${BASE_URL}/races/race/${raceId}`;

	const raceResponse = await axios.delete<
		DeleteResult | ResponseError,
		AxiosResponse<DeleteResult | ResponseError>
	>(url, { validateStatus: () => true });

	const { status, data } = raceResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as DeleteResult;
};
