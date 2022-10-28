import axios, { AxiosResponse } from 'axios';

import { MemberGame, Sort, ResponseError } from 'v1/types';

/**
 * Returns data about the completion of Curator games by MasochistME members.
 *
 * ### Filter options
 *
 * - `memberId` - filters by member's Steam ID,
 * - `gameId` - filters by game's Steam ID,
 * - `completed` - filters entries by completed games.
 *
 * ### Sort options
 *
 * - `playTime` - sort by game's playtime (in hours),
 * - `completionPercentage` - sort by game's completion percentage,
 * - `mostRecentAchievementDate` - sort by the date of most recent unlocked achievement.
 *
 * ## Usage
 *
 * ```ts
 * const completionsAll: MemberGame[] = await sdk.getGameCompletionList();
 * const completionsOneGame: MemberGame[] = await sdk.getGameCompletionList({ filter: { gameId: 254692 }});
 * const completionsNewest: MemberGame[] =
 *  await sdk.getGameCompletionList({ filter: { completed: true }, sort: { mostRecentAchievementDate: 'desc' }});
 * ```
 *
 * @param params.filter - Filter to apply to returned completions list.
 * @param params.sort - Fields to sort completions list by.
 * @param params.limit - How many completions will get returned.
 */
export const getGameCompletionList = async (
	params: GameCompletionListParams,
	/** @ignore */
	BASE_URL: string,
): Promise<MemberGame[]> => {
	const { filter, sort, limit } = params;
	const url = `${BASE_URL}/games/completion/list`;

	const gamesResponse = await axios.post<
		MemberGame[] | ResponseError,
		AxiosResponse<MemberGame[] | ResponseError>
	>(url, { filter, sort, limit }, { validateStatus: () => true });

	const { status, data } = gamesResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as MemberGame[];
};

export type GameCompletionListParams = {
	filter?: Partial<Pick<MemberGame, 'memberId' | 'gameId'>> & {
		completed?: boolean;
	};
	sort?: {
		[key in
			| keyof Partial<
					Pick<
						MemberGame,
						'playTime' | 'mostRecentAchievementDate' | 'achievementsUnlocked'
					>
			  >
			| 'completionPercentage']?: Sort;
	};
	limit?: number;
};
