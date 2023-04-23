import axios, { AxiosResponse } from 'axios';
import { DeleteResult } from 'mongodb';

import { ResponseError } from 'v1/types';

/**
 * Removes a badge from an existing member.
 *
 * Badge is identified by its stringified `ObjectID`.
 * Member is be identified by their Discord ID.
 *
 * ## Usage
 *
 * ```ts
 * const badgeId: string = "567678d96778a6876cc78";
 * const memberId: string = "2938274356793";
 *
 * const {
 * 	acknowledged,
 * 	deletedCount,
 * } = await sdk.revokeBadgeFromMemberById({ badgeId, memberId });
 * ```
 *
 * @param params.badgeId  - ID of the badge to remove from selected member.
 * @param params.memberId - ID of member which is supposed to have a badge revoked.
 */
export const revokeBadgeFromMemberById = async (
	params: { badgeId: string; memberId: string },
	/** @ignore */
	BASE_URL: string,
): Promise<DeleteResult> => {
	const { badgeId, memberId } = params;
	const url = `${BASE_URL}/members/member/${memberId}/badges/badge/${badgeId}`;

	const memberBadgeResponse = await axios.delete<
		DeleteResult | ResponseError,
		AxiosResponse<DeleteResult | ResponseError>
	>(url, { validateStatus: () => true });

	const { status, data } = memberBadgeResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as DeleteResult;
};
