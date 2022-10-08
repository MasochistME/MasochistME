import axios, { AxiosResponse } from 'axios';

import { Race, ResponseError } from 'v2/types';

/**
 * Creates a new race.
 * @param race Omit<Race, '_id'>
 * @returns Race | ResponseError
 */
export const createRace =
	async ({ race }: { race: Omit<Race, '_id'> }) =>
	async (BASE_URL: string): Promise<Race | ResponseError> => {
		const url = `${BASE_URL}/race`;

		const raceResponse = await axios.post<
			Race | ResponseError,
			AxiosResponse<Race | ResponseError>,
			Omit<Race, '_id'>
		>(url, race);

		const { status, data } = raceResponse;

		if (status !== 201) throw data as ResponseError;
		return data as Race;
	};
