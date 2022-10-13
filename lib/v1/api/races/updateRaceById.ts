import axios, { AxiosResponse } from 'axios';
import { UpdateResult } from 'mongodb';

import { Race, ResponseError } from 'v1/types';

/**
 * Updates a race by updating the fields that the user had passed.
 * @category Races
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
