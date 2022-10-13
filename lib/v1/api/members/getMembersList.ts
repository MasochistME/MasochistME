/** @module Members */

import axios, { AxiosResponse } from 'axios';

import { Member, ResponseError } from 'v1/types';

/**
 * Returns a list of all members.
 *
 * @category Members
 * @function
 *
 * @return  {Member[]}  List of all members.
 */
export const getMembersList = async (BASE_URL: string): Promise<Member[]> => {
	const url = `${BASE_URL}/members/list`;

	const memberResponse = await axios.get<
		Member[] | ResponseError,
		AxiosResponse<Member[] | ResponseError>
	>(url, { validateStatus: () => true });

	const { status, data } = memberResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as Member[];
};
