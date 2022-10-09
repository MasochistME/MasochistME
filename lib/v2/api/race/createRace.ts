import { InsertOneResult } from 'mongodb';
import axios, { AxiosResponse } from 'axios';

import { Race, ResponseError } from 'v2/types';

/**
 * Creates a new race.
 * @param race Omit<Race, '_id'>
 * @returns InsertOneResult<Race>
 */
export const createRace = async (
	{ race }: { race: Omit<Race, '_id'> },
	BASE_URL: string,
): Promise<InsertOneResult<Race>> => {
	const url = `${BASE_URL}/race`;

	const raceResponse = await axios.post<
		InsertOneResult<Race> | ResponseError,
		AxiosResponse<InsertOneResult<Race> | ResponseError>,
		Omit<Race, '_id'>
	>(url, race, { validateStatus: () => true });

	const { status, data } = raceResponse;

	if (status !== 201) throw new Error((data as ResponseError).error);
	return data as InsertOneResult<Race>;
};
