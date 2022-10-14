import axios, { AxiosResponse } from 'axios';

import { RacePlayer, ResponseError } from 'v1/types';

/**
 * Returns a list of all participants from a single race by given ID (if it exists).
 *
 * Race is identified by its stringified `ObjectID`.
 *
 * ## Usage
 * ```ts
 * const raceId: string = "5f5e555d5a578b6";
 * const participants: RacePlayer[] = await sdk.getRaceParticipantsList({ raceId });
 * ```
 *
 * @category Race participants
 * @param params.raceId - ID of the race to get its participants from.
 */
export const getRaceParticipantsList = async (
	params: { raceId: string },
	/** @ignore */
	BASE_URL: string,
): Promise<RacePlayer[]> => {
	const { raceId } = params;
	const url = `${BASE_URL}/races/race/${raceId}/participants/list`;

	const racePlayerResponse = await axios.get<
		RacePlayer[] | ResponseError,
		AxiosResponse<RacePlayer[] | ResponseError>
	>(url, { validateStatus: () => true });

	const { status, data } = racePlayerResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as RacePlayer[];
};
