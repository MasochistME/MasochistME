import axios, { AxiosResponse } from 'axios';
import { InsertOneResult } from 'mongodb';

import { RacePlayer, ResponseError } from 'v1/types';

/**
 * Signs a user up for participatind in a specific race.
 * @category Race participants
 * @param params.raceId   - ID of a race to sign a member to.
 * @param params.memberId - ID of a member that wishes to sign into a race.
 */
export const joinRaceByParticipantId = async (
	params: { raceId: string; memberId: string },
	/** @ignore */
	BASE_URL: string,
): Promise<InsertOneResult<RacePlayer>> => {
	const { raceId, memberId } = params;
	const url = `${BASE_URL}/races/race/${raceId}/participants/participant/${memberId}`;

	const racePlayerResponse = await axios.post<
		InsertOneResult<RacePlayer> | ResponseError,
		AxiosResponse<InsertOneResult<RacePlayer> | ResponseError>
	>(url, {}, { validateStatus: () => true });

	const { status, data } = racePlayerResponse;

	if (status !== 201) throw new Error((data as ResponseError).error);
	return data as InsertOneResult<RacePlayer>;
};
