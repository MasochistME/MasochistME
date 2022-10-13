import axios, { AxiosResponse } from 'axios';

import { Race, ResponseError } from 'v1/types';

/**
 * Returns a list of all the races that were ever registered.
 * @category Races
 */
export const getRaceList = async (
	/** @ignore */
	BASE_URL: string,
): Promise<Race[]> => {
	const url = `${BASE_URL}/races/list`;

	const raceResponse = await axios.get<
		Race[] | ResponseError,
		AxiosResponse<Race[] | ResponseError>
	>(url, { validateStatus: () => true });

	const { status, data } = raceResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as Race[];
};
