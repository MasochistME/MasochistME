import axios, { AxiosResponse } from 'axios';

import { Season, ResponseError } from 'v1/types';

/**
 * Gets an active season by the given ID (if it exists).
 *
 * Season is identified by its stringified `ObjectID`.
 *
 * ## Usage
 *
 * ```ts
 * const seasonId: string = "9e9f99daa45c7";
 * const season = await sdk.getSeasonById({ seasonId });
 * ```
 *
 * @param params.seasonId - ID of the season to be started.
 */
export const getSeasonById = async (
	params: { seasonId: string },
	/** @ignore */
	BASE_URL: string,
): Promise<Season> => {
	const { seasonId } = params;
	const url = `${BASE_URL}/seasons/season/${seasonId}`;

	const seasonResponse = await axios.get<
		Season | ResponseError,
		AxiosResponse<Season | ResponseError>
	>(url, { validateStatus: () => true });

	const { status, data } = seasonResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as Season;
};
