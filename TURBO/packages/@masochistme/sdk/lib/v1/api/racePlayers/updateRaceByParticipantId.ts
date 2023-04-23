import axios, { AxiosResponse } from 'axios';
import { UpdateResult } from 'mongodb';

import {
	RacePlayer,
	RacePlayerScore,
	RacePlayerTime,
	ResponseError,
} from 'v1/types';

/**
 * Updates a race participant by given ID (if it exists).
 *
 * Race is identified by its stringified `ObjectID`.
 * Participant is identified by their Discord ID.
 *
 * ### Updatable fields
 * - `startDate`
 * - `endDate`
 * - `dnf`
 *
 * ## Usage
 *
 * ```ts
 * const raceId: string = "5f5e555d5a578b6";
 * const memberId: string = "9674893087456";
 * const update: Partial<RacePlayer> = { dnf: true };
 *
 * const {
 * 	acknowledged,
 * 	matchedCount,
 * 	modifiedCount,
 * 	upsertedCount,
 * 	upsertedId,
 * } = await sdk.updateRaceByParticipantId({ raceId, memberId, update });
 * ```
 *
 * @param params.raceId   - ID of the race in which requested user participates.
 * @param params.memberId - Discord ID of the race participant to be updated.
 * @param params.update   - Fields that need to be changed.
 */
export const updateRaceByParticipantId = async (
	params: {
		raceId: string;
		memberId: string;
		update: Partial<Omit<RacePlayerScore | RacePlayerTime, '_id' | 'type'>>;
	},
	/** @ignore */
	BASE_URL: string,
): Promise<UpdateResult> => {
	const { raceId, memberId, update } = params;
	const url = `${BASE_URL}/races/race/${raceId}/participants/participant/${memberId}`;

	const racePlayerResponse = await axios.put<
		UpdateResult | ResponseError,
		AxiosResponse<UpdateResult | ResponseError>,
		Partial<Omit<RacePlayer, '_id' | 'type'>>
	>(url, update, { validateStatus: () => true });

	const { status, data } = racePlayerResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as UpdateResult;
};
