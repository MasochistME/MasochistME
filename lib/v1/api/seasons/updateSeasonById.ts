import axios, { AxiosResponse } from 'axios';
import { UpdateResult } from 'mongodb';

import { Season, ResponseError } from 'v1/types';

/**
 * Updates a season by given ID (if it exists).
 *
 * Season is identified by its stringified `ObjectID`.
 *
 * ### Updatable fields
 * - `name`
 * - `description`
 * - `icon`
 *
 * ## Usage
 *
 * ```ts
 * const seasonId: string = "9e9f99daa45c7";
 * const season: Partial<Season> = {
 * 	name: "Updated season name",
 * };
 *
 * const {
 * 	acknowledged,
 * 	matchedCount,
 * 	modifiedCount,
 * 	upsertedCount,
 * 	upsertedId,
 * } = await sdk.updateSeasonById({ seasonId, season });
 * ```
 *
 * @param params.seasonId - ID of the season to be updated.
 * @param params.season   - fields that should be changed in a season, if it exists.
 */
export const updateSeasonById = async (
	params: {
		seasonId: string;
		season: Partial<Omit<Season, '_id'>>;
	},
	/** @ignore */
	BASE_URL: string,
): Promise<UpdateResult> => {
	const { seasonId, season } = params;
	const url = `${BASE_URL}/seasons/season/${seasonId}`;

	const seasonResponse = await axios.put<
		UpdateResult | ResponseError,
		AxiosResponse<UpdateResult | ResponseError>,
		Partial<Omit<Season, '_id'>>
	>(url, season, { validateStatus: () => true });

	const { status, data } = seasonResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as UpdateResult;
};
