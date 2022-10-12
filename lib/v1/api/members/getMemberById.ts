import axios, { AxiosResponse } from 'axios';

import { Member, ResponseError } from 'v1/types';

/**
 * Returns a member by given ID, if it exists.
 * @param memberId string
 * @returns Member
 */
export const getMemberById = async (
	{ memberId }: { memberId: string },
	BASE_URL: string,
): Promise<Member> => {
	const url = `${BASE_URL}/members/member/${memberId}`;

	const memberResponse = await axios.get<
		Member | ResponseError,
		AxiosResponse<Member | ResponseError>
	>(url, { validateStatus: () => true });

	const { status, data } = memberResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as Member;
};
