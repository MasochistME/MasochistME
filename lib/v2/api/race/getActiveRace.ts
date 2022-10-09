import axios, { AxiosResponse } from 'axios';

import { Race, ResponseError } from 'v2/types';

/**
 * Returns a list of all the present and future races, sorting them by which starts the sooner.
 * @returns Race[]
 */
export const getActiveRace = async (BASE_URL: string): Promise<Race[]> => {
	const url = `${BASE_URL}/race/active`;

	const raceResponse = await axios.get<
		Race[] | ResponseError,
		AxiosResponse<Race[] | ResponseError>
	>(url, { validateStatus: () => true });

	const { status, data } = raceResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as Race[];
};
