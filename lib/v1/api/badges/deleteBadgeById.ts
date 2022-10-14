import axios, { AxiosResponse } from 'axios';
import { DeleteResult } from 'mongodb';

import { ResponseError } from 'v1/types';

/**
 * Delete a badge with given ID (if it exists).
 *
 * Badge is identified by its stringified `ObjectID`.
 *
 * ## Usage
 *
 * ```ts
 * const badgeId: string = "5f5e555d5a578b6";
 * const {
 * 	acknowledged,
 * 	deletedCount,
 * } = await sdk.deleteBadgeById({ bagdeId });
 * ```
 *
 * @param params.badgeId - ID of the badge to delete.
 */
export const deleteBadgeById = async (
	params: { badgeId: string },
	/** @ignore */
	BASE_URL: string,
): Promise<DeleteResult> => {
	const { badgeId } = params;
	const url = `${BASE_URL}/badges/badge/${badgeId}`;

	const badgeResponse = await axios.delete<
		DeleteResult | ResponseError,
		AxiosResponse<DeleteResult | ResponseError>
	>(url, { validateStatus: () => true });

	const { status, data } = badgeResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as DeleteResult;
};
