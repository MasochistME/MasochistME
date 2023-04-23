import axios, { AxiosResponse } from 'axios';
import { UpdateResult } from 'mongodb';

import { Badge, ResponseError } from 'v1/types';

/**
 * Updates a badge by given ID.
 *
 * Badge is identified by its stringified `ObjectID`.
 *
 * ### Updatable fields
 * - `name`
 * - `description`
 * - `points`
 * - `requirements`
 * - `image`
 *
 * ## Usage
 *
 * ```ts
 * const badgeId: string = "5f5e555d5a578b6";
 * const badge: Partial<Badge> = {
 *	points: 10,
 * };
 *
 * const {
 * 	acknowledged,
 * 	matchedCount,
 * 	modifiedCount,
 * 	upsertedCount,
 * 	upsertedId,
 * } = await sdk.updateBadgeById({ badgeId, badge });
 * ```
 *
 * @param params.badgeId - ID of the badge to update.
 * @param params.badge   - Fields to update in the badge of given ID.
 */
export const updateBadgeById = async (
	params: { badgeId: string; badge: Partial<Omit<Badge, '_id'>> },
	/** @ignore */
	BASE_URL: string,
): Promise<UpdateResult> => {
	const { badgeId, badge } = params;
	const url = `${BASE_URL}/badges/badge/${badgeId}`;

	const badgeResponse = await axios.put<
		UpdateResult | ResponseError,
		AxiosResponse<UpdateResult | ResponseError>,
		Partial<Omit<Badge, '_id'>>
	>(url, badge, { validateStatus: () => true });

	const { status, data } = badgeResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as UpdateResult;
};
