import axios, { AxiosResponse } from 'axios';
import { InsertOneResult } from 'mongodb';

import { MemberBadge, ResponseError } from 'v1/types';

/**
 * Gives an existing badge to an existing member.
 *
 * Badge is identified by its stringified `ObjectID`.
 * Member is identified by their Discord ID.
 *
 * ## Usage
 *
 * ```ts
 * const badgeId: string = "567678d96778a6876cc78";
 * const memberId: string = "2938274356793";
 *
 * const {
 * 	acknowledged,
 *  insertedId,
 * } = await sdk.giveBadgeToMemberById({ badgeId, memberId });
 * ```
 *
 * @param params.badgeId  - ID of the badge to give to selected member.
 * @param params.memberId - ID of member which is supposed to get a badge.
 */
export const giveBadgeToMemberById = async (
	params: { badgeId: string; memberId: string },
	/** @ignore */
	BASE_URL: string,
): Promise<InsertOneResult<MemberBadge>> => {
	const { badgeId, memberId } = params;
	const url = `${BASE_URL}/members/member/${memberId}/badges/badge/${badgeId}`;

	const memberBadgeResponse = await axios.post<
		InsertOneResult<MemberBadge> | ResponseError,
		AxiosResponse<InsertOneResult<MemberBadge> | ResponseError>
	>(url, {}, { validateStatus: () => true });

	const { status, data } = memberBadgeResponse;

	if (status !== 201) throw new Error((data as ResponseError).error);
	return data as InsertOneResult<MemberBadge>;
};
