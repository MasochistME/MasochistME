import axios, { AxiosResponse } from 'axios';
import { InsertOneResult } from 'mongodb';

import { Season, ResponseError } from 'v1/types';

/**
 * Creates a new inactive season.
 *
 * ## Usage
 *
 * ```ts
 * const season: Pick<Season, 'name' | 'description' | 'icon'> = {
 * 	name: "Season III",
 * 	description: "It's a third racing season!",
 * 	icon: "http://http.cat/404.jpg",
 * };
 *
 * const {
 * 	acknowledged,
 * 	insertedId,
 * } = await sdk.createSeason({ season });
 * ```
 *
 * @param params.season - Object representing a season to be created.
 */
export const createSeason = async (
	params: {
		season: Omit<Season, '_id'>;
	},
	/** @ignore */
	BASE_URL: string,
): Promise<InsertOneResult<Season>> => {
	const { season } = params;
	const url = `${BASE_URL}/seasons`;

	const seasonResponse = await axios.post<
		InsertOneResult<Season> | ResponseError,
		AxiosResponse<InsertOneResult<Season> | ResponseError>,
		Omit<Season, '_id'>
	>(url, season, { validateStatus: () => true });

	const { status, data } = seasonResponse;

	if (status !== 201) throw new Error((data as ResponseError).error);
	return data as InsertOneResult<Season>;
};
