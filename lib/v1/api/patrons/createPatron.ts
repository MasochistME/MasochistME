import axios, { AxiosResponse } from 'axios';
import { InsertOneResult } from 'mongodb';

import { Patron, ResponseError } from 'v1/types';

/**
 * Creates a new patron.
 *
 * ## Usage
 *
 * ```ts
 * const patron: Omit<Patron, '_id'> = {
 *  memberId: "6547839284576",
 * 	tier: "4",
 * 	username: null,
 * 	avatar: null,
 * };
 *
 * const {
 * 	acknowledged,
 * 	insertedId,
 * } = await sdk.createPatron({ patron });
 * ```
 *
 * @param params.patron - Data of the new patron.
 */
export const createPatron = async (
	params: { patron: Omit<Patron, '_id'> },
	/** @ignore */
	BASE_URL: string,
): Promise<InsertOneResult<Patron>> => {
	const { patron } = params;
	const url = `${BASE_URL}/patrons`;

	const response = await axios.post<
		InsertOneResult<Patron> | ResponseError,
		AxiosResponse<InsertOneResult<Patron> | ResponseError>,
		Omit<Patron, '_id'>
	>(url, patron, { validateStatus: () => true });

	const { status, data } = response;

	if (status !== 201) throw new Error((data as ResponseError).error);
	return data as InsertOneResult<Patron>;
};
