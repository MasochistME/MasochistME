import axios, { AxiosResponse } from 'axios';

import { MemberIdEither, RacePlayer, ResponseError } from 'v1/types';

/**
 * Returns an object representing a single participant in a single race.
 * @param raceId string
 * @param steamId string | never
 * @param discordId string | never
 * @returns RacePlayer
 */
export const getRaceParticipantById = async (
	{ raceId, steamId, discordId }: { raceId: string } & MemberIdEither,
	BASE_URL: string,
): Promise<RacePlayer> => {
	const memberId = steamId ?? discordId;
	const url = `${BASE_URL}/races/race/${raceId}/participants/participant/${memberId}`;

	const racePlayerResponse = await axios.get<
		RacePlayer | ResponseError,
		AxiosResponse<RacePlayer | ResponseError>
	>(url, { validateStatus: () => true });

	const { status, data } = racePlayerResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as RacePlayer;
};
