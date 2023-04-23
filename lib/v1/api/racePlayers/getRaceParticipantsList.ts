import axios, { AxiosResponse } from 'axios';

import {
	RacePlayer,
	Sort,
	ResponseError,
	RacePlayerScore,
	RacePlayerTime,
} from 'v1/types';

/**
 * Returns a list of all participants from a single race by given ID (if it exists).
 *
 * Race is identified by its stringified `ObjectID`.
 *
 * ### Filter options
 *
 * - `dnf` - filter participants by their status of finishing the race.
 *
 * ### Sort options
 *
 * - `startDate` - sort participants by their start date
 * - `endDate` - sort participants by their end date
 * - `score` - sort participants by their score
 *
 * ## Usage
 * ```ts
 * const raceId: string = "5f5e555d5a578b6";
 * const participantsAll: RacePlayer[] = await sdk.getRaceParticipantsList({ raceId });
 * const participantsDnf: RacePlayer[] = await sdk.getRaceParticipantsList({ raceId, filter: { dnf: true }});
 * const participantsLeaderboards: RacePlayer[] =
 * 	await sdk.getRaceParticipantsList({ raceId, sort: { score: 'desc' }});
 * ```
 *
 * @param params.raceId - ID of the race to get its participants from.
 * @param params.filter - Filter to apply to returned race participants list.
 * @param params.sort - Fields to sort race participants list by.
 * @param params.limit - How many race participants will get returned.
 */
export const getRaceParticipantsList = async (
	params: RaceParticipantsListParams,
	/** @ignore */
	BASE_URL: string,
): Promise<RacePlayer[]> => {
	const { raceId, filter, sort, limit } = params;
	const url = `${BASE_URL}/races/race/${raceId}/participants/list`;

	const racePlayerResponse = await axios.post<
		RacePlayer[] | ResponseError,
		AxiosResponse<RacePlayer[] | ResponseError>
	>(url, { filter, sort, limit }, { validateStatus: () => true });

	const { status, data } = racePlayerResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as RacePlayer[];
};

export type RaceParticipantsListParams = {
	raceId: string;
	filter?:
		| Partial<Pick<RacePlayerTime, 'dnf' | 'disqualified' | 'disqualifiedBy'>>
		| Partial<
				Pick<
					RacePlayerScore,
					'dnf' | 'disqualified' | 'disqualifiedBy' | 'isWarned'
				>
		  >;
	sort?: {
		[key in keyof Partial<
			Pick<RacePlayerScore, 'startDate' | 'endDate' | 'score'>
		>]: Sort;
	};
	limit?: number;
};
