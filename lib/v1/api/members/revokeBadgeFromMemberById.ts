import axios, { AxiosResponse } from 'axios';
import { DeleteResult } from 'mongodb';

import { ResponseError } from 'v1/types';

/**
 * Removes a badge by given badge ID from member by their Discord ID.
 *
 * @category Members
 * @function
 *
 * @param   {String}  								   badgeId   ID of the badge to remove.
 * @param   {String}  									 memberId  Discord ID of the requested member.
 * @return  {DeleteResult<MemberBadge>}						 MongoDB delete result object.
 */
export const revokeBadgeFromMemberById = async (
	{ badgeId, memberId }: { badgeId: string; memberId: string },
	BASE_URL: string,
): Promise<DeleteResult> => {
	const url = `${BASE_URL}/members/member/${memberId}/badges/badge/${badgeId}`;

	const memberBadgeResponse = await axios.delete<
		DeleteResult | ResponseError,
		AxiosResponse<DeleteResult | ResponseError>
	>(url, { validateStatus: () => true });

	const { status, data } = memberBadgeResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as DeleteResult;
};
