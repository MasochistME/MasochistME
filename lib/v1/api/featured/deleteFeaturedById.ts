import axios, { AxiosResponse } from 'axios';
import { DeleteResult } from 'mongodb';

import { ResponseError } from 'v1/types';

/**
 * Delete a featured object with given ID (if it exists).
 *
 * Featured object is identified by its stringified `ObjectID`.
 *
 * ## Usage
 *
 * ```ts
 * const featuredId: string = "5f5e555d5a578b6";
 * const {
 * 	acknowledged,
 * 	deletedCount,
 * } = await sdk.deleteFeaturedById({ featuredId });
 * ```
 *
 * @param params.featuredId - ID of the featured object to delete.
 */
export const deleteFeaturedById = async (
	params: { featuredId: string },
	/** @ignore */
	BASE_URL: string,
): Promise<DeleteResult> => {
	const { featuredId } = params;
	const url = `${BASE_URL}/featured/${featuredId}`;

	const response = await axios.delete<
		DeleteResult | ResponseError,
		AxiosResponse<DeleteResult | ResponseError>
	>(url, { validateStatus: () => true });

	const { status, data } = response;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as DeleteResult;
};
