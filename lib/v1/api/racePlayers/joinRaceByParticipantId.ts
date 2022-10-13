/** @module Races */

import { InsertOneResult } from 'mongodb';
import axios, { AxiosResponse } from 'axios';

import { RacePlayer, ResponseError } from 'v1/types';

/**
 * Signs a user up for participatin in a specific race.
 *
 * @category Races
 * @subcategory Participants
 * @function
 *
 * @param 	{String}      					 raceId    ID of the race.
 * @param   {String}      				   memberId  Discord ID of the requested race participant.
 * @return  {InsertOneResult<Race>}            MongoDB insert one result object.
 */
export const joinRaceByParticipantId = async (
	{ raceId, memberId }: { raceId: string; memberId: string },
	BASE_URL: string,
): Promise<InsertOneResult<RacePlayer>> => {
	const url = `${BASE_URL}/races/race/${raceId}/participants/participant/${memberId}`;

	const racePlayerResponse = await axios.post<
		InsertOneResult<RacePlayer> | ResponseError,
		AxiosResponse<InsertOneResult<RacePlayer> | ResponseError>
	>(url, {}, { validateStatus: () => true });

	const { status, data } = racePlayerResponse;

	if (status !== 201) throw new Error((data as ResponseError).error);
	return data as InsertOneResult<RacePlayer>;
};
