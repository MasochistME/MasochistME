import axios, { AxiosResponse } from 'axios';

import {
	MemberAchievement,
	MemberIdEither,
	Sort,
	ResponseError,
} from 'v1/types';

/**
 * Returns a list of all badges belonging to a member.
 * Member can be identified by either Discord ID or Steam ID, but at least one of those values **must** be provided.
 *
 * ### Filter options
 *
 * - `gameId` - filters by ID of the Steam game the badge belongs to,
 *
 * ### Sort options
 *
 * - `unlockTime` - sorts by badge's point value.
 *
 * ## Usage
 *
 * ```ts
 * const steamId: string = "567876545678";
 *
 * const memberAchievements: MemberAchievement[] =
 *   await sdk.getMemberAchievementList({ steamId });
 * const memberAchievementsFromNewest: MemberAchievement[] =
 *   await sdk.getMemberAchievementList({ steamId, sort: { unlockTime: 'desc' }});
 * const memberAchievementsByGame: MemberAchievement[] =
 *   await sdk.getMemberAchievementList({ steamId, filter: { gameId: '666' }});
 * ```
 *
 * @param params.steamId   - (Optional) Steam ID of the requested member.
 * @param params.discordId - (Optional) Discord ID of the requested member.
 * @param params.filter    - Filter to apply to returned achievement list.
 * @param params.sort      - Fields to sort achievement list by.
 * @param params.limit     - How many achievements will get returned.
 */
export const getMemberAchievementList = async (
	params: MemberAchievementListParams,
	/** @ignore */
	BASE_URL: string,
): Promise<MemberAchievement[]> => {
	const { steamId, discordId, filter, sort, limit } = params;
	const memberId = steamId ?? discordId;
	const url = `${BASE_URL}/members/member/${memberId}/achievements/list`;

	const memberAchievementListResponse = await axios.post<
		MemberAchievement[] | ResponseError,
		AxiosResponse<MemberAchievement[] | ResponseError>
	>(url, { filter, sort, limit }, { validateStatus: () => true });

	const { status, data } = memberAchievementListResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as MemberAchievement[];
};

export type MemberAchievementListParams = MemberIdEither & {
	filter?: Partial<Pick<MemberAchievement, 'gameId'>>;
	sort?: {
		[key in keyof Partial<Pick<MemberAchievement, 'unlockTime'>>]: Sort;
	};
	limit?: number;
};
