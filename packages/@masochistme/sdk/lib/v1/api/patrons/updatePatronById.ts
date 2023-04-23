import axios, { AxiosResponse } from 'axios';
import { UpdateResult } from 'mongodb';

import { Patron, ResponseError } from 'v1/types';

/**
 * Updates a patron by given ID.
 *
 * Patron is identified by their stringified `ObjectID`.
 *
 * ## Usage
 *
 * ```ts
 * const patronId: string = "5f5e555d5a578b6";
 * const patron: Partial<Patron> = {
 * 	tier: "3"
 * };
 *
 * const {
 * 	acknowledged,
 * 	matchedCount,
 * 	modifiedCount,
 * 	upsertedCount,
 * 	upsertedId,
 * } = await sdk.updatePatronById({ patronId, patron });
 * ```
 *
 * @param params.patronId - ID of the patron to update.
 * @param params.patron   - Fields to update in the patron of given ID.
 */
export const updatePatronById = async (
	params: {
		patronId: string;
		patron: Partial<Omit<Patron, '_id'>>;
	},
	/** @ignore */
	BASE_URL: string,
): Promise<UpdateResult> => {
	const { patronId, patron } = params;
	const url = `${BASE_URL}/patrons/patron/${patronId}`;

	const response = await axios.put<
		UpdateResult | ResponseError,
		AxiosResponse<UpdateResult | ResponseError>,
		Partial<Omit<Patron, '_id'>>
	>(url, patron, { validateStatus: () => true });

	const { status, data } = response;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as UpdateResult;
};
