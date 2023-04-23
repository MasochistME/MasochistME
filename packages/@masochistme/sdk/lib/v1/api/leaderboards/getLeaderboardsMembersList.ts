import axios, { AxiosResponse } from 'axios';

import { Leaderboards, Sort, ResponseError } from 'v1/types';

/**
 * Returns MasochistME leaderboards.
 *
 * ### Filter options
 *
 * - `patreonTier` - filters by member's Patreon status,
 * - `isMember` - filters by user's member status in the MasochistME curator.
 *
 * ### Sort options
 *
 * - `position` - sorts by member's position on leaderboards,
 * - `gamesTotal` - sorts by member's number of all completed games,
 * - `badgesTotal` - sorts by member's number of all collected badges,
 * - `gamePoints` - sorts by member's amount of poins for all games,
 * - `badgePoints` - sorts by member's amount of points for all badges.
 *
 * ## Usage
 *
 * ```ts
 * const leaderboards: Leaderboards[] = await sdk.getLeaderboardsMembersList({ });
 * const leaderboardsByBadges: Game[] = await sdk.getLeaderboardsMembersList({ sort: { badgePoints: 'asc' }});
 * ```
 *
 * @param params.filter - Filter to apply to leaderboards list.
 * @param params.sort - Fields to sort leaderboards by.
 * @param params.limit - How many leaderboard entries will get returned.
 */
export const getLeaderboardsMembersList = async (
	params: LeaderboardsMembersListParams,
	/** @ignore */
	BASE_URL: string,
): Promise<Leaderboards[]> => {
	const { filter, sort, limit } = params;
	const url = `${BASE_URL}/leaderboards/members/list`;

	const leaderboardsResponse = await axios.post<
		Leaderboards[] | ResponseError,
		AxiosResponse<Leaderboards[] | ResponseError>
	>(url, { filter, sort, limit }, { validateStatus: () => true });

	const { status, data } = leaderboardsResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as Leaderboards[];
};

export type LeaderboardsMembersListParams = {
	filter?: { patreonTier?: number; isMember?: boolean; from?: Date; to?: Date };
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
