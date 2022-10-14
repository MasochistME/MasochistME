import axios, { AxiosResponse } from 'axios';

import { Member, ResponseError } from 'v1/types';

/**
 * Returns a list of all members.
 *
 * ## Usage
 *
 * ```ts
 * const members: Member[] = await sdk.getMembersList();
 * ```
 *
 * @category Members
 */
export const getMembersList = async (
	/** @ignore */
	BASE_URL: string,
): Promise<Member[]> => {
	const url = `${BASE_URL}/members/list`;

	const memberResponse = await axios.get<
		Member[] | ResponseError,
		AxiosResponse<Member[] | ResponseError>
	>(url, { validateStatus: () => true });

	const { status, data } = memberResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as Member[];
};
