import axios, { AxiosResponse } from 'axios';

import { Leaderboards, Sort, ResponseError } from 'v1/types';

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
): Promise<Leaderboards[]> => {
	const { filter, sort, limit } = params;
	const url = `${BASE_URL}/leaderboards/games/list`;

	const leaderboardsResponse = await axios.post<
		Leaderboards[] | ResponseError,
		AxiosResponse<Leaderboards[] | ResponseError>
	>(url, { filter, sort, limit }, { validateStatus: () => true });

	const { status, data } = leaderboardsResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as Leaderboards[];
};

export type LeaderboardsGamesListParams = {
	filter?: { patreonTier?: number; isMember?: boolean };
	sort?: {
		[key in
			| 'position'
			| 'gamesTotal'
			| 'badgesTotal'
			| 'gamePoints'
			| 'badgePoints']: Sort;
	};
	limit?: number;
};
