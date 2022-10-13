/** @module Races */

import axios, { AxiosResponse } from 'axios';

import { RacePlayer, ResponseError } from 'v1/types';

/**
 * Returns an object representing a single participant in a single race.
 *
 * @category Races
 * @subcategory Participants
 * @function
 *
 * @param 	{String}      raceId    ID of the race.
 * @param   {String}      memberId  Discord ID of the requested race participant.
 * @return  {RacePlayer}						Data of the race participant, if it exists.
 */
export const getRaceParticipantById = async (
	{ raceId, memberId }: { raceId: string; memberId: string },
	BASE_URL: string,
): Promise<RacePlayer> => {
	const url = `${BASE_URL}/races/race/${raceId}/participants/participant/${memberId}`;

	const racePlayerResponse = await axios.get<
		RacePlayer | ResponseError,
		AxiosResponse<RacePlayer | ResponseError>
	>(url, { validateStatus: () => true });

	const { status, data } = racePlayerResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as RacePlayer;
};
