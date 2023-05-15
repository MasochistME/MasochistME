import axios, { AxiosResponse } from 'axios';

import { Member, Sort, ResponseError } from 'v1/types';

/**
 * Returns a list of all members.
 *
 * ### Filter options
 *
 * - `isMember` - filters by user's curator membership status,
 * - `isPrivate` - filters by user's Steam privacy settings,
 *
 * ### Sort options
 *
 * - `lastUpdated` - sorts by the time passed since last member's profile update.
 *
 * ## Usage
 *
 * ```ts
 * const membersAll: Member[] = await sdk.getMembersList({ });
 * const membersInactive: Member[] = await sdk.getMembersList({ sort: { lastUpdated: 'desc' }});
 * const membersCurator: Member[] = await sdk.getMembersList({ filter: { isMember: true }});
 * ```
 *
 * @param params.filter - Filter to apply to returned member list.
 * @param params.sort - Fields to sort member list by.
 * @param params.limit - How many members will get returned.
 */
export const getMembersList = async (
	params: MembersListParams,
	/** @ignore */
	BASE_URL: string,
): Promise<Member[]> => {
	const { filter, sort, limit } = params;
	const url = `${BASE_URL}/members/list`;

	const memberResponse = await axios.post<
		Member[] | ResponseError,
		AxiosResponse<Member[] | ResponseError>
	>(url, { filter, sort, limit }, { validateStatus: () => true });

	const { status, data } = memberResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as Member[];
};

export type MembersListParams = {
	filter?: Partial<Pick<Member, 'isPrivate' | 'isMember'>>;
	sort?: {
		[key in keyof Partial<Pick<Member, 'name' | 'lastUpdated'>>]: Sort;
	};
	limit?: number;
};
