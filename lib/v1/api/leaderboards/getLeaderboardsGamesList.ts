import axios, { AxiosResponse } from 'axios';

import { GameLeaderboards, Sort, ResponseError } from 'v1/types';

/**
 * Returns MasochistME games leaderboards.
 *
 * TODO description
 *
 * @param params.filter - Filter to apply to leaderboards list.
 * @param params.sort - Fields to sort leaderboards by.
 * @param params.limit - How many leaderboard entries will get returned.
 */
export const getLeaderboardsGamesList = async (
	params: LeaderboardsGamesListParams,
	/** @ignore */
	BASE_URL: string,
): Promise<GameLeaderboards[]> => {
	const { filter, sort, limit } = params;
	const url = `${BASE_URL}/leaderboards/games/list`;

	const leaderboardsResponse = await axios.post<
		GameLeaderboards[] | ResponseError,
		AxiosResponse<GameLeaderboards[] | ResponseError>
	>(url, { filter, sort, limit }, { validateStatus: () => true });

	const { status, data } = leaderboardsResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as GameLeaderboards[];
};

export type LeaderboardsGamesListParams = {
	filter?: { patreonTier?: number; isMember?: boolean; from?: Date; to?: Date };
	sort?: {
		[key in 'owners' | 'avgPlaytime']: Sort;
	};
	limit?: number;
};
