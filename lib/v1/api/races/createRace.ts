/** @module Races */

import { InsertOneResult } from 'mongodb';
import axios, { AxiosResponse } from 'axios';

import { Race, ResponseError } from 'v1/types';

/**
 * Creates a new race.
 *
 * @category Races
 * @function
 *
 * @param   {Omit<Race, '_id'>} 		 race  Data of the race to create.
 * @return  {InsertOneResult<Race>}				 MongoDB insert one result object.
 */
export const createRace = async (
	{ race }: { race: Omit<Race, '_id'> },
	BASE_URL: string,
): Promise<InsertOneResult<Race>> => {
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
