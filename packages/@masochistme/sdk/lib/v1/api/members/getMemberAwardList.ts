import axios, { AxiosResponse } from 'axios';

import { Award, MemberAward, MemberIdEither, ResponseError } from 'v1/types';

/**
 * Returns a list of all awards belonging to a member.
 * Member can be identified by either Discord ID or Steam ID, but at least one of those values **must** be provided.
 *
 * ### Filter options
 *
 * - `category` - filters by category the award belongs to,
 * - `isLegacy` - filters by award's `legacy` status,
 * - `isEnabled` - filters by award's `enabled` status.
 *
 * ### Sort options
 *
 * None so far!
 *
 * ## Usage
 *
 * ```ts
 * const steamId: string = "567876545678";
 * const award: Award[] = await sdk.getMemberAwardList({ steamId });
 * ```
 *
 * @param params.steamId   - (Optional) Steam ID of the requested member.
 * @param params.discordId - (Optional) Discord ID of the requested member.
 * @param params.filter - Filter to apply to returned award list.
 * @param params.sort - Fields to sort award list by.
 * @param params.limit - How many award will get returned.
 */
export const getMemberAwardList = async (
	params: MemberAwardListParams,
	/** @ignore */
	BASE_URL: string,
): Promise<MemberAward[]> => {
	const { steamId, discordId, filter, sort, limit } = params;
	const memberId = steamId ?? discordId;
	const url = `${BASE_URL}/members/member/${memberId}/awards/list`;

	const memberAwardListResponse = await axios.post<
		MemberAward[] | ResponseError,
		AxiosResponse<MemberAward[] | ResponseError>
	>(url, { filter, sort, limit }, { validateStatus: () => true });

	const { status, data } = memberAwardListResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as MemberAward[];
};

// TODO Think if it should return just the MemberAward[], or actual Award[]

export type MemberAwardListParams = MemberIdEither & {
	filter?: Partial<Pick<Award, 'category' | 'isEnabled' | 'isLegacy'>>;
	sort?: {
		// [key in keyof Partial<Pick<Award, 'TODO'>>]: Sort;
	};
	limit?: number;
};
