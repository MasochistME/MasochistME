import axios, { AxiosResponse } from 'axios';
import { InsertOneResult } from 'mongodb';

import { Award, ResponseError } from 'v1/types';

/**
 * Creates a new award.
 *
 * ## Usage
 *
 * ```ts
 * const award: Omit<Award, '_id'|'requirement'> = {
 *   name: "Masoveteran",
 *   description: "Award given for being a Masochist.ME member for 10 years.",
 *   img: "http://http.cat/404.jpg",
 *   category: "5f5affe76ba7865769",
 *   children: [],
 * 	 isStackable: false,
 * 	 isEnabled: true,
 *   isLegacy: false
 * };
 *
 * [TODO] Allow adding children here as well!!!
 *
 * const {
 * 	acknowledged,
 * 	insertedId,
 * } = await sdk.createAward({ award });
 * ```
 *
 * @param params.award - Data of the new award. All fields of the type Award are required.
 */
export const createAward = async (
	params: { award: Partial<Omit<Award, '_id' | 'requirements'>> },
	/** @ignore */
	BASE_URL: string,
): Promise<InsertOneResult<Award>> => {
	const { award } = params;
	const url = `${BASE_URL}/awards`;

	const awardResponse = await axios.post<
		InsertOneResult<Award> | ResponseError,
		AxiosResponse<InsertOneResult<Award> | ResponseError>,
		Partial<Omit<Award, '_id' | 'requirements'>>
	>(url, award, { validateStatus: () => true });

	const { status, data } = awardResponse;

	if (status !== 201) throw new Error((data as ResponseError).error);
	return data as InsertOneResult<Award>;
};
