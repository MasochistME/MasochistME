/** @module RaceParticipants */

import axios, { AxiosResponse } from 'axios';

import { RacePlayer, ResponseError } from 'v1/types';

/**
 * Returns a list of all participants from a single race.
 *
 * @category Races
 * @subcategory Participants
 * @function
 *
 * @param 	{String}        raceId  ID of the race.
 * @return 	{RacePlayer[]}          List of all participants of the particular race.
 */
export const getRaceParticipantsList = async (
	{ raceId }: { raceId: string },
	BASE_URL: string,
): Promise<RacePlayer[]> => {
	const url = `${BASE_URL}/races/race/${raceId}/participants/list`;

	const racePlayerResponse = await axios.get<
		RacePlayer[] | ResponseError,
		AxiosResponse<RacePlayer[] | ResponseError>
	>(url, { validateStatus: () => true });

	const { status, data } = racePlayerResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as RacePlayer[];
};
