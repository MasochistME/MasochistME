import { ObjectId } from 'mongodb';
import axios, { AxiosResponse } from 'axios';

import { Race, ResponseError } from 'v2/types';

/**
 * Edits a race by updating the fields that the user had passed.
 * @param id ObjectId
 * @param race Partial<Omit<Race, '_id'>>
 * @returns Race | ResponseError
 */
export const editRaceById =
	async ({ id, race }: { id: ObjectId; race: Partial<Omit<Race, '_id'>> }) =>
	async (BASE_URL: string): Promise<Race | ResponseError> => {
		const url = `${BASE_URL}/race/id/${id}`;

		const raceResponse = await axios.put<
			Race | ResponseError,
			AxiosResponse<Race | ResponseError>,
			Partial<Omit<Race, '_id'>>
		>(url, race);

		const { status, data } = raceResponse;

		if (status !== 200) throw data as ResponseError;
		return data as Race;
	};
