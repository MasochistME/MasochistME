import axios, { AxiosResponse } from 'axios';
import { UpdateResult } from 'mongodb';

import { Race, ResponseError } from 'v1/types';

/**
 * Updates a race by given ID (if it exists).
 *
 * ### Updatable fields
 * - `name`
 * - `instructions`
 * - `objectives`
 * - `startDate`
 * - `endDate`
 * - `downloadLink`
 * - `downloadGrace`
 * - `uploadGrace`
 * - `icon`
 * - `isActive`
 * - `isDone`
 *
 * ## Usage
 * ```ts
 * const raceId: string = "5f5e555d5a578b6";
 * const race: Partial<Race> = {
 *	downloadLink: "http://http.cat/201.jpg",
 * };
 *
 * const {
 * 	acknowledged,
 * 	matchedCount,
 * 	modifiedCount,
 * 	upsertedCount,
 * 	upsertedId,
 * } = await sdk.updateRaceById({ raceId, race });
 * ```
 *
 * @param params.raceId - ID of the race to update.
 * @param params.race   - Fields to update in the chosen race.
 */
export const updateRaceById = async (
	params: { raceId: string; race: Partial<Omit<Race, '_id'>> },
	/** @ignore */
	BASE_URL: string,
): Promise<UpdateResult> => {
	const { raceId, race } = params;
	const url = `${BASE_URL}/races/race/${raceId}`;

	const raceResponse = await axios.put<
		UpdateResult | ResponseError,
		AxiosResponse<UpdateResult | ResponseError>,
		Partial<Omit<Race, '_id'>>
	>(url, race, { validateStatus: () => true });

	const { status, data } = raceResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as UpdateResult;
};
