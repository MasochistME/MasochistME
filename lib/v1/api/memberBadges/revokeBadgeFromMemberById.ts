import axios, { AxiosResponse } from 'axios';
import { DeleteResult } from 'mongodb';

import { ResponseError } from 'v1/types';

/**
 * Removes a badge by given badge ID from member by given member ID.
 * @param memberId string - Steam ID of the user
 * @param badgeId string
 * @returns DeleteResult<MemberBadge>
 */
export const revokeBadgeFromMemberById = async (
	{ memberId, badgeId }: { memberId: string; badgeId: string },
	BASE_URL: string,
): Promise<DeleteResult> => {
	const url = `${BASE_URL}/members/member/${memberId}/badges/${badgeId}`;

	const memberBadgeResponse = await axios.delete<
		DeleteResult | ResponseError,
		AxiosResponse<DeleteResult | ResponseError>
	>(url, { validateStatus: () => true });

	const { status, data } = memberBadgeResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as DeleteResult;
};
