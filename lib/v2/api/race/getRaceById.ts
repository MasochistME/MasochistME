import axios, { AxiosResponse } from 'axios';

import { Race, ResponseError } from 'v2/types';

/**
 * Returns a race fron the database given the id, if it exists.
 * @param id string
 * @returns Race
 */
export const getRaceById = async (
	{ id }: { id: string },
	BASE_URL: string,
): Promise<Race> => {
	const url = `${BASE_URL}/race/id/${id}`;

	const raceResponse = await axios.get<
		Race | ResponseError,
		AxiosResponse<Race | ResponseError>
	>(url, { validateStatus: () => true });

	const { status, data } = raceResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as Race;
};
