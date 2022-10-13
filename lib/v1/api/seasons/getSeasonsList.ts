import axios, { AxiosResponse } from 'axios';

import { Season, ResponseError } from 'v1/types';

/**
 * Returns a list of all seasons.
 * @category Seasons
 * @param params.finished - Get only seasons which are finished.
 * @param params.inactive - Get only seasons which are yet to start.
 */
export const getSeasonsList = async (
	params: { finished?: boolean; inactive?: boolean },
	/** @ignore */
	BASE_URL: string,
): Promise<Season[]> => {
	const { finished = undefined, inactive = undefined } = params;
	const url = `${BASE_URL}/seasons/list`;

	const seasonResponse = await axios.post<
		Season[] | ResponseError,
		AxiosResponse<Season[] | ResponseError>
	>(
		url,
		{ ...(finished && { finished }), ...(inactive && { inactive }) },
		{ validateStatus: () => true },
	);

	const { status, data } = seasonResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as Season[];
};
