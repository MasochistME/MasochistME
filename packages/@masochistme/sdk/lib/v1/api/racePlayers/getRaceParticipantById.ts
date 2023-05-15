import axios, { AxiosResponse } from 'axios';

import { RacePlayer, ResponseError } from 'v1/types';

/**
 * Returns an object representing a race participant (if they exist).
 *
 * Race is retrieved by its stringified `ObjectId`.
 * Member is retrieved by their Discord ID.
 *
 * ## Usage
 *
 * ```ts
 * const raceId: string = "89d88787e899caa8";
 * const memberId: string = "3498759483298";
 *
 * const participant: RacePlayer =
 * 	await sdk.getRaceParticipantById({ raceId, memberId });
 * ```
 *
 * @param params.raceId   - ID of the race that member participates in.
 * @param params.memberId - Discord ID of the chosen race participant.
 */
export const getRaceParticipantById = async (
	params: { raceId: string; memberId: string },
	/** @ignore */
	BASE_URL: string,
): Promise<RacePlayer> => {
	const { raceId, memberId } = params;
	const url = `${BASE_URL}/races/race/${raceId}/participants/participant/${memberId}`;

	const racePlayerResponse = await axios.get<
		RacePlayer | ResponseError,
		AxiosResponse<RacePlayer | ResponseError>
	>(url, { validateStatus: () => true });

	const { status, data } = racePlayerResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as RacePlayer;
};
