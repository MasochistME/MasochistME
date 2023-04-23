import axios, { AxiosResponse } from 'axios';

import { SeasonLeaderboardEntry, ResponseError } from 'v1/types';

/**
 * Gets leaderboards for a season by the given ID (if it exists).
 *
 * Season is identified by its stringified `ObjectID`.
 *
 * ## Usage
 *
 * ```ts
 * const seasonId: string = "9e9f99daa45c7";
 * const seasonLeaderboards = await sdk.getSeasonLeaderboardsById({ seasonId });
 * ```
 *
 * @param params.seasonId - ID of the season to get leaderboards of.
 */
export const getSeasonLeaderboardsById = async (
	params: { seasonId: string },
	/** @ignore */
	BASE_URL: string,
): Promise<SeasonLeaderboardEntry[]> => {
	const { seasonId } = params;
	const url = `${BASE_URL}/seasons/season/${seasonId}/leaderboards`;

	const seasonResponse = await axios.get<
		SeasonLeaderboardEntry[] | ResponseError,
		AxiosResponse<SeasonLeaderboardEntry[] | ResponseError>
	>(url, { validateStatus: () => true });

	const { status, data } = seasonResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as SeasonLeaderboardEntry[];
};
