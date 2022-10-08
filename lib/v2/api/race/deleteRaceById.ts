import { ObjectId } from 'mongodb';
import axios, { AxiosResponse } from 'axios';

import { ResponseError } from 'v2/types';

/**
 * Deletes a race.
 * @param id ObjectId
 * @returns boolean | ResponseError
 */
export const deleteRaceById =
	async ({ id }: { id: ObjectId }) =>
	async (BASE_URL: string): Promise<boolean | ResponseError> => {
		const url = `${BASE_URL}/race/id/${id}`;

		const raceResponse = await axios.delete<
			boolean | ResponseError,
			AxiosResponse<boolean | ResponseError>
		>(url);

		const { status, data } = raceResponse;

		if (status !== 200) throw data as ResponseError;
		return true;
	};
