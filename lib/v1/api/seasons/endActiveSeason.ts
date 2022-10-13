import axios, { AxiosResponse } from 'axios';
import { UpdateResult } from 'mongodb';

import { ResponseError } from 'v1/types';

/**
 * Ends an active season, if there is any.
 *
 * @category Seasons
 * @function
 *
 * @return  {UpdateResult}  MongoDB update result object.
 */
export const endActiveSeason = async (
	BASE_URL: string,
): Promise<UpdateResult> => {
	const url = `${BASE_URL}/seasons/active`;

	const seasonResponse = await axios.put<
		UpdateResult | ResponseError,
		AxiosResponse<UpdateResult | ResponseError>
	>(url, {}, { validateStatus: () => true });

	const { status, data } = seasonResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as UpdateResult;
};
