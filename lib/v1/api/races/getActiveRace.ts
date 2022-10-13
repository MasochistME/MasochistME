/** @module Races */

import axios, { AxiosResponse } from 'axios';

import { Race, ResponseError } from 'v1/types';

/**
 * Returns a list of all the present and future races, sorting them by which starts the sooner.
 *
 * @category Races
 * @function
 *
 * @return  {Race[]}  A list of all races that are either ongoing or wait for starting.
 */
export const getActiveRace = async (BASE_URL: string): Promise<Race[]> => {
	const url = `${BASE_URL}/races/active`;

	const raceResponse = await axios.get<
		Race[] | ResponseError,
		AxiosResponse<Race[] | ResponseError>
	>(url, { validateStatus: () => true });

	const { status, data } = raceResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as Race[];
};
