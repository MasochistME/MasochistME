import axios, { AxiosResponse } from 'axios';
import { DeleteResult } from 'mongodb';

import { ResponseError } from 'v1/types';

/**
 * Deletes a race by given ID (if it exists).
 *
 * Race is identified by its stringified `ObjectID`.
 *
 * ## Usage
 * ```ts
 * const raceId: string = "57da777687ecf89";
 * const {
 * 	acknowledged,
 * 	deletedCount,
 * } = await deleteRaceById({ raceId });
 * ```
 *
 * @param params.raceId - ID of the race to be deleted.
 */
export const deleteRaceById = async (
	params: { raceId: string },
	/** @ignore */
	BASE_URL: string,
): Promise<DeleteResult> => {
	const { raceId } = params;
	const url = `${BASE_URL}/races/race/${raceId}`;

	const raceResponse = await axios.delete<
		DeleteResult | ResponseError,
		AxiosResponse<DeleteResult | ResponseError>
	>(url, { validateStatus: () => true });

	const { status, data } = raceResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as DeleteResult;
};
