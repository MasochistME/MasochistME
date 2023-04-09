import axios, { AxiosResponse } from 'axios';

import { Award, ResponseError } from 'v1/types';

/**
 * Retrieve an award with given ID (if it exists).
 * If requested award has children they will get returned with it.
 *
 * Award is identified by its stringified `ObjectID`.
 *
 * ## Usage
 *
 * ```ts
 * const awardId: string = "5f5e555d5a578b6";
 * const award: Award = await sdk.getAwardById({ awardId });
 * ```
 *
 * @param params.awardId - ID of the award to fetch.
 */
export const getAwardById = async (
	params: { awardId: string },
	/** @ignore */
	BASE_URL: string,
): Promise<Award> => {
	const { awardId } = params;
	const url = `${BASE_URL}/awards/award/${awardId}`;

	const awardResponse = await axios.get<
		Award | ResponseError,
		AxiosResponse<Award | ResponseError>
	>(url, { validateStatus: () => true });

	const { status, data } = awardResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as Award;
};
