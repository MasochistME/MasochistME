import axios, { AxiosResponse } from 'axios';
import { UpdateResult } from 'mongodb';

import { Award, ResponseError } from 'v1/types';

/**
 * Updates an award by given ID.
 *
 * Award is identified by its stringified `ObjectID`.
 *
 * ### Updatable fields
 * - `name`
 * - `description`
 * - `img`
 * - `category`
 * - `requirements`
 * - `children`
 * - `isStackable`
 * - `isEnabled`
 * - `isLegacy`
 *
 * ## Usage
 *
 * ```ts
 * const awardId: string = "5f5e555d5a578b6";
 * const award: Partial<Award> = {
 *	name: "Sadoveteran",
 * };
 *
 * const {
 * 	acknowledged,
 * 	matchedCount,
 * 	modifiedCount,
 * 	upsertedCount,
 * 	upsertedId,
 * } = await sdk.updateAwardById({ awardId, award });
 * ```
 *
 * @param params.awardId - ID of the award to update.
 * @param params.award   - Fields to update in the award of given ID.
 */
export const updateAwardById = async (
	params: { awardId: string; award: Partial<Omit<Award, '_id'>> },
	/** @ignore */
	BASE_URL: string,
): Promise<UpdateResult> => {
	const { awardId, award } = params;
	const url = `${BASE_URL}/awards/award/${awardId}`;

	const awardResponse = await axios.put<
		UpdateResult | ResponseError,
		AxiosResponse<UpdateResult | ResponseError>,
		Partial<Omit<Award, '_id'>>
	>(url, award, { validateStatus: () => true });

	const { status, data } = awardResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as UpdateResult;
};
