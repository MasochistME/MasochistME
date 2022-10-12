import { InsertOneResult } from 'mongodb';
import axios, { AxiosResponse } from 'axios';

import { MemberBadge, MemberIdEither, ResponseError } from 'v1/types';

/**
 * Gives a badge by given badge ID to member by either Steam ID or Discord ID.
 * @param badgeId string
 * @param steamId string | never
 * @param discordId string | never
 * @returns InsertOneResult<MemberBadge>
 */
export const giveBadgeToMemberById = async (
	{ badgeId, steamId, discordId }: { badgeId: string } & MemberIdEither,
	BASE_URL: string,
): Promise<InsertOneResult<MemberBadge>> => {
	const memberId = steamId ?? discordId;
	const url = `${BASE_URL}/members/member/${memberId}/badges/badge/${badgeId}`;

	const memberBadgeResponse = await axios.post<
		InsertOneResult<MemberBadge> | ResponseError,
		AxiosResponse<InsertOneResult<MemberBadge> | ResponseError>
	>(url, {}, { validateStatus: () => true });

	const { status, data } = memberBadgeResponse;

	if (status !== 201) throw new Error((data as ResponseError).error);
	return data as InsertOneResult<MemberBadge>;
};
