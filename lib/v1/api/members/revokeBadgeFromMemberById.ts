import axios, { AxiosResponse } from 'axios';
import { DeleteResult } from 'mongodb';

import { MemberIdEither, ResponseError } from 'v1/types';

/**
 * Removes a badge by given badge ID from member by either Steam ID or Discord ID.
 * @param badgeId string
 * @param steamId string | never
 * @param discordId string | never
 * @returns DeleteResult<MemberBadge>
 */
export const revokeBadgeFromMemberById = async (
	{ badgeId, steamId, discordId }: { badgeId: string } & MemberIdEither,
	BASE_URL: string,
): Promise<DeleteResult> => {
	const memberId = steamId ?? discordId;
	const url = `${BASE_URL}/members/member/${memberId}/badges/badge/${badgeId}`;

	const memberBadgeResponse = await axios.delete<
		DeleteResult | ResponseError,
		AxiosResponse<DeleteResult | ResponseError>
	>(url, { validateStatus: () => true });

	const { status, data } = memberBadgeResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as DeleteResult;
};
