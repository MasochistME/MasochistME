import axios, { AxiosResponse } from 'axios';
import { UpdateResult } from 'mongodb';

import { MemberIdEither, RacePlayer, ResponseError } from 'v1/types';

type Update = Partial<Pick<RacePlayer, 'startTime' | 'endTime' | 'dnf'>> & {
	score?: number;
};
/**
 * Updates a race participant object.
 * @param raceId string
 * @param update string
 * @param steamId string | never
 * @param discordId string | never
 * @returns UpdateResult
 */
export const updateRaceByParticipantId = async (
	{
		raceId,
		update,
		steamId,
		discordId,
	}: {
		raceId: string;
		update: Update;
	} & MemberIdEither,
	BASE_URL: string,
): Promise<UpdateResult> => {
	const memberId = steamId ?? discordId;
	const url = `${BASE_URL}/races/race/${raceId}/participants/participant/${memberId}`;

	const racePlayerResponse = await axios.put<
		UpdateResult | ResponseError,
		AxiosResponse<UpdateResult | ResponseError>,
		Update
	>(url, update, { validateStatus: () => true });

	const { status, data } = racePlayerResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as UpdateResult;
};
