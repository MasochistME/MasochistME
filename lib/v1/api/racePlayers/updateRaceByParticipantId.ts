import axios, { AxiosResponse } from 'axios';
import { UpdateResult } from 'mongodb';

import { RacePlayer, ResponseError } from 'v1/types';

export type Update = Partial<
	Pick<RacePlayer, 'startTime' | 'endTime' | 'dnf'>
> & {
	score?: number;
};
/**
 * Updates a race participant object.
 *
 * @category Race participants
 */
export const updateRaceByParticipantId = async (
	{
		raceId,
		memberId,
		update,
	}: {
		raceId: string;
		memberId: string;
		update: Update;
	},
	BASE_URL: string,
): Promise<UpdateResult> => {
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
