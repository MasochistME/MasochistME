import axios, { AxiosResponse } from 'axios';
import { DeleteResult } from 'mongodb';

import { ResponseError } from 'v1/types';

/**
 * Delete an award with given ID (if it exists).
 *
 * Award is identified by its stringified `ObjectID`.
 *
 * ## Usage
 *
 * ```ts
 * const awardId: string = "5f5e555d5a578b6";
 * const {
 * 	acknowledged,
 * 	deletedCount,
 * } = await sdk.deleteAwardById({ awardId });
 * ```
 *
 * @param params.awardId - ID of the award to delete.
 */
export const deleteAwardById = async (
	params: { awardId: string },
	/** @ignore */
	BASE_URL: string,
): Promise<DeleteResult> => {
	const { awardId } = params;
	const url = `${BASE_URL}/awards/award/${awardId}`;

	const awardResponse = await axios.delete<
		DeleteResult | ResponseError,
		AxiosResponse<DeleteResult | ResponseError>
	>(url, { validateStatus: () => true });

	const { status, data } = awardResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as DeleteResult;
};
