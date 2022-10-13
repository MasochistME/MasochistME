import axios, { AxiosResponse } from 'axios';
import { InsertOneResult } from 'mongodb';

import { Race, ResponseError } from 'v1/types';

/**
 * Creates a new race.
 * @category Races
 * @param params.race - Object with the data of the new race.
 */
export const createRace = async (
	params: { race: Omit<Race, '_id'> },
	/** @ignore */
	BASE_URL: string,
): Promise<InsertOneResult<Race>> => {
	const { race } = params;
	const url = `${BASE_URL}/races`;

	const raceResponse = await axios.post<
		InsertOneResult<Race> | ResponseError,
		AxiosResponse<InsertOneResult<Race> | ResponseError>,
		Omit<Race, '_id'>
	>(url, race, { validateStatus: () => true });

	const { status, data } = raceResponse;

	if (status !== 201) throw new Error((data as ResponseError).error);
	return data as InsertOneResult<Race>;
};
