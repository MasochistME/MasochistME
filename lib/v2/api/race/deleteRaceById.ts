import axios, { AxiosResponse } from 'axios';
import { DeleteResult } from 'mongodb';

import { ResponseError } from 'v2/types';

/**
 * Deletes a race.
 * @param id string
 * @returns DeleteResult
 */
export const deleteRaceById = async (
	{ id }: { id: string },
	BASE_URL: string,
): Promise<DeleteResult> => {
	const url = `${BASE_URL}/race/id/${id}`;

	const raceResponse = await axios.delete<
		DeleteResult | ResponseError,
		AxiosResponse<DeleteResult | ResponseError>
	>(url, { validateStatus: () => true });

	const { status, data } = raceResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as DeleteResult;
};
