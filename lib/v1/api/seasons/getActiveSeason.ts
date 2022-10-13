import axios, { AxiosResponse } from 'axios';

import { Season, ResponseError } from 'v1/types';

/**
 * Returns data of an active season, if there is any.
 * @returns Season
 */
export const getActiveSeason = async (BASE_URL: string): Promise<Season> => {
	const url = `${BASE_URL}/seasons/active`;

	const seasonResponse = await axios.get<
		Season | ResponseError,
		AxiosResponse<Season | ResponseError>
	>(url, { validateStatus: () => true });

	const { status, data } = seasonResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as Season;
};
