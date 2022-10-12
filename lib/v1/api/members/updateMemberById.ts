import axios, { AxiosResponse } from 'axios';
import { UpdateResult } from 'mongodb';

import { Member, ResponseError } from 'v1/types';

type MemberUpdate = Partial<Pick<Member, 'description'>>;
/**
 * Updates a member by updating the fields that the user had passed.
 * @param memberId string
 * @param member MemberUpdate
 * @returns UpdateResult
 */
export const updateMemberById = async (
	{ memberId, member }: { memberId: string; member: MemberUpdate },
	BASE_URL: string,
): Promise<UpdateResult> => {
	const url = `${BASE_URL}/members/member/${memberId}`;

	const memberResponse = await axios.put<
		UpdateResult | ResponseError,
		AxiosResponse<UpdateResult | ResponseError>,
		MemberUpdate
	>(url, member, { validateStatus: () => true });

	const { status, data } = memberResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as UpdateResult;
};
