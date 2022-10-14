import axios, { AxiosResponse } from 'axios';
import { UpdateResult } from 'mongodb';

import { ResponseError } from 'v1/types';

/**
 * Starts a new season by the given ID (if it exists).
 * The season must already be created AND inactive.
 *
 * Season is identified by its stringified `ObjectID`.
 *
 * ## Usage
 *
 * ```ts
 * const {
 * 	acknowledged,
 * 	matchedCount,
 * 	modifiedCount,
 * 	upsertedCount,
 * 	upsertedId,
 * } = await sdk.startSeasonById({ seasonId: "9e9f99daa45c7" });
 * ```
 * @category Seasons
 * @param params.seasonId - ID of the season to be started.
 */
export const startSeasonById = async (
	params: { seasonId: string },
	/** @ignore */
	BASE_URL: string,
): Promise<UpdateResult> => {
	const { seasonId } = params;
	const url = `${BASE_URL}/seasons/season/${seasonId}`;

	const seasonResponse = await axios.post<
		UpdateResult | ResponseError,
		AxiosResponse<UpdateResult | ResponseError>
	>(url, {}, { validateStatus: () => true });

	const { status, data } = seasonResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as UpdateResult;
};
