import axios, { AxiosResponse } from 'axios';
import { UpdateResult } from 'mongodb';

import { Season, ResponseError } from 'v1/types';

/**
 * Ends an active season by the given ID (if it exists).
 * The season must already be created AND active AND NOT finished.
 *
 * Season is identified by its stringified `ObjectID`.
 *
 * ## Usage
 *
 * ```ts
 * const seasonId: string = "9e9f99daa45c7";
 * const {
 * 	acknowledged,
 * 	matchedCount,
 * 	modifiedCount,
 * 	upsertedCount,
 * 	upsertedId,
 * } = await sdk.endSeasonById({ seasonId });
 * ```
 *
 * @param params.seasonId - ID of the season to be ended.
 */
export const endSeasonById = async (
	params: { seasonId: string },
	/** @ignore */
	BASE_URL: string,
): Promise<UpdateResult> => {
	const { seasonId } = params;
	const url = `${BASE_URL}/seasons/season/${seasonId}`;

	const seasonResponse = await axios.put<
		UpdateResult | ResponseError,
		AxiosResponse<UpdateResult | ResponseError>,
		Pick<Season, 'endDate'>
	>(url, { endDate: new Date() }, { validateStatus: () => true });

	const { status, data } = seasonResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as UpdateResult;
};
