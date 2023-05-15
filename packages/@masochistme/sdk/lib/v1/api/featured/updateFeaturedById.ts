import axios, { AxiosResponse } from 'axios';
import { UpdateResult } from 'mongodb';

import { Featured, ResponseError } from 'v1/types';

/**
 * Updates a featured object by given ID.
 *
 * Featured object is identified by its stringified `ObjectID`.
 *
 * ## Usage
 *
 * ```ts
 * const featuredId: string = "5f5e555d5a578b6";
 * const featured: Partial<Featured> = {
 *	description: "I actually won this run",
 * };
 *
 * const {
 * 	acknowledged,
 * 	matchedCount,
 * 	modifiedCount,
 * 	upsertedCount,
 * 	upsertedId,
 * } = await sdk.updateFeaturedById({ featuredId, featured });
 * ```
 *
 * @param params.featuredId - ID of the featured object to update.
 * @param params.featured   - Fields to update in the featured object of given ID.
 */
export const updateFeaturedById = async (
	params: {
		featuredId: string;
		featured: Partial<Omit<Featured, '_id'>>;
	},
	/** @ignore */
	BASE_URL: string,
): Promise<UpdateResult> => {
	const { featuredId, featured } = params;
	const url = `${BASE_URL}/featured/${featuredId}`;

	const response = await axios.put<
		UpdateResult | ResponseError,
		AxiosResponse<UpdateResult | ResponseError>,
		Partial<Omit<Featured, '_id'>>
	>(url, featured, { validateStatus: () => true });

	const { status, data } = response;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as UpdateResult;
};
