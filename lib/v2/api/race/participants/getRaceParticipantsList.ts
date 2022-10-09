import axios, { AxiosResponse } from 'axios';

import { RacePlayer, ResponseError } from 'v2/types';

/**
 * Returns a list of all participants from a single race.
 * @param raceId string
 * @returns RacePlayer[]
 */
export const getRaceParticipantsList = async (
	{ raceId }: { raceId: string },
	BASE_URL: string,
): Promise<RacePlayer[]> => {
	const url = `${BASE_URL}/race/${raceId}/participants/list`;

	const racePlayerResponse = await axios.get<
		RacePlayer[] | ResponseError,
		AxiosResponse<RacePlayer[] | ResponseError>
	>(url, { validateStatus: () => true });

	const { status, data } = racePlayerResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as RacePlayer[];
};
