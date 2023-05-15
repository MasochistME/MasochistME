import axios, { AxiosResponse } from 'axios';
import { DeleteResult } from 'mongodb';

import { ResponseError } from 'v1/types';

/**
 * Removes an award from an existing member.
 *
 * Award is identified by its stringified `ObjectID`.
 * Member is be identified by their Discord ID.
 *
 * ## Usage
 *
 * ```ts
 * const awardId: string = "567678d96778a6876cc78";
 * const memberId: string = "2938274356793";
 *
 * const {
 * 	acknowledged,
 * 	deletedCount,
 * } = await sdk.revokeAwardFromMemberById({ awardId, memberId });
 * ```
 *
 * @param params.awardId  - ID of the award to remove from selected member.
 * @param params.memberId - ID of member which is supposed to have an award revoked.
 */
export const revokeAwardFromMemberById = async (
	params: { awardId: string; memberId: string },
	/** @ignore */
	BASE_URL: string,
): Promise<DeleteResult> => {
	const { awardId, memberId } = params;
	const url = `${BASE_URL}/members/member/${memberId}/awards/award/${awardId}`;

	const memberAwardResponse = await axios.delete<
		DeleteResult | ResponseError,
		AxiosResponse<DeleteResult | ResponseError>
	>(url, { validateStatus: () => true });

	const { status, data } = memberAwardResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as DeleteResult;
};
