import { InsertOneResult } from 'mongodb';
import axios, { AxiosResponse } from 'axios';

import { RacePlayer, ResponseError } from 'v2/types';

/**
 * Signs a user up for participatin in a specific race.
 * @param raceId string
 * @param discordId string
 * @returns InsertOneResult<Race>
 */
export const joinRaceByParticipantId = async (
	{ raceId, discordId }: { raceId: string; discordId: string },
	BASE_URL: string,
): Promise<InsertOneResult<RacePlayer>> => {
	const url = `${BASE_URL}/race/${raceId}/participant/${discordId}`;

	const racePlayerResponse = await axios.post<
		InsertOneResult<RacePlayer> | ResponseError,
		AxiosResponse<InsertOneResult<RacePlayer> | ResponseError>
	>(url, {}, { validateStatus: () => true });

	const { status, data } = racePlayerResponse;

	if (status !== 201) throw new Error((data as ResponseError).error);
	return data as InsertOneResult<RacePlayer>;
};
