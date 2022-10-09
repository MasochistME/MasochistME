import axios, { AxiosResponse } from 'axios';

import { RacePlayer, ResponseError } from 'v2/types';

/**
 * Returns an object representing a single participant in a single race.
 * @param raceId string
 * @param discordId string
 * @returns RacePlayer
 */
export const getRaceParticipantById = async (
	{ raceId, discordId }: { raceId: string; discordId: string },
	BASE_URL: string,
): Promise<RacePlayer> => {
	const url = `${BASE_URL}/race/${raceId}/participant/${discordId}`;

	const racePlayerResponse = await axios.get<
		RacePlayer | ResponseError,
		AxiosResponse<RacePlayer | ResponseError>
	>(url, { validateStatus: () => true });

	const { status, data } = racePlayerResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as RacePlayer;
};
