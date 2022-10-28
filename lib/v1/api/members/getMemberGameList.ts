import axios, { AxiosResponse } from 'axios';

import {
	Game,
	MemberGame,
	MemberIdEither,
	Sort,
	ResponseError,
} from 'v1/types';

/**
 * Returns a list of all games belonging to a member.
 * Member can be identified by either Discord ID or Steam ID, but at least one of those values **must** be provided.
 *
 * ### Filter options
 *
 * - `completionPercentage` - filters by EXACT completion percentage of the game by member,
 * - `isCurated` - filters by game's curation status.
 *
 * ### Sort options
 *
 * - `playTime` - sorts by member's play time of their games,
 * - `completionPercentage` - sorts by member's completion percentage of all their games,
 * - `tier` - sorts by member's games tier,
 * - `achievementsTotal` - sorts by number of achievements of the member's games.
 *
 * ## Usage
 *
 * ```ts
 * const steamId: string = "567876545678";
 *
 * const memberGames: MemberGame[] = await sdk.getMemberGameList({ steamId });
 * const memberGamesCompleted: MemberGame[] =
 *   await sdk.getMemberGameList({ steamId, filter: { completed: 100 }});
 * const memberGamesByAchievements: MemberGame[] =
 *   await sdk.getMemberGameList({ steamId, sort: { achievementsTotal: 'desc' }});
 * ```
 *
 * @param params.steamId   - (Optional) Steam ID of the requested member.
 * @param params.discordId - (Optional) Discord ID of the requested member.
 * @param params.filter - Filter to apply to returned member's game list.
 * @param params.sort - Fields to sort member's game list by.
 * @param params.limit - How many member's games will get returned.
 */
export const getMemberGameList = async (
	params: MemberGameListParams,
	/** @ignore */
	BASE_URL: string,
): Promise<MemberGame[]> => {
	const { steamId, discordId, filter, sort, limit } = params;
	const memberId = steamId ?? discordId;
	const url = `${BASE_URL}/members/member/${memberId}/games/list`;

	const memberGameListResponse = await axios.post<
		MemberGame[] | ResponseError,
		AxiosResponse<MemberGame[] | ResponseError>
	>(url, { filter, sort, limit }, { validateStatus: () => true });

	const { status, data } = memberGameListResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as MemberGame[];
};

export type MemberGameListParams = MemberIdEither & {
	filter?: Partial<Pick<Game, 'isCurated'>> & { completionPercentage: number };
	sort?: {
		[key in
			| keyof Partial<Pick<MemberGame, 'playTime'>>
			| keyof Partial<Pick<Game, 'tier' | 'achievementsTotal'>>
			| 'completionPercentage']?: Sort;
	};
	limit?: number;
};
