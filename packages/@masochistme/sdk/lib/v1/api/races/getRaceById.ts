import axios, { AxiosResponse } from 'axios';

import { RaceWithParticipants, ResponseError } from 'v1/types';

/**
 * Returns a race by the given ID (if it exists).
 *
 * Race is identified by its stringified `ObjectID`.
 *
 * ## Usage
 * ```ts
 * const raceId: string = "57da777687ecf89";
 * const race: Race = await sdk.getRaceById({ raceId });
 * ```
 *
 * @param params.raceId - ID of the race to fetch.
 */
export const getRaceById = async (
	params: { raceId: string },
	/** @ignore */
	BASE_URL: string,
): Promise<RaceWithParticipants> => {
	const { raceId } = params;
	const url = `${BASE_URL}/races/race/${raceId}`;

	const raceResponse = await axios.get<
		RaceWithParticipants | ResponseError,
		AxiosResponse<RaceWithParticipants | ResponseError>
	>(url, { validateStatus: () => true });

	const { status, data } = raceResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as RaceWithParticipants;
};
