import axios, { AxiosResponse } from 'axios';
import { InsertOneResult } from 'mongodb';

import { MemberAward, ResponseError } from 'v1/types';

/**
 * Gives an existing award to an existing member.
 *
 * Award is identified by its stringified `ObjectID`.
 * Member is identified by their Discord ID.
 *
 * ## Usage
 *
 * ```ts
 * const awardId: string = "567678d96778a6876cc78";
 * const memberId: string = "2938274356793";
 *
 * const {
 * 	acknowledged,
 *  insertedId,
 * } = await sdk.giveAwardToMemberById({ awardId, memberId });
 * ```
 *
 * @param params.awardId  - ID of the award to give to selected member.
 * @param params.memberId - ID of member which is supposed to get an award.
 */
export const giveAwardToMemberById = async (
	params: { awardId: string; memberId: string },
	/** @ignore */
	BASE_URL: string,
): Promise<InsertOneResult<MemberAward>> => {
	const { awardId, memberId } = params;
	const url = `${BASE_URL}/members/member/${memberId}/awards/award/${awardId}`;

	const memberAwardResponse = await axios.post<
		InsertOneResult<MemberAward> | ResponseError,
		AxiosResponse<InsertOneResult<MemberAward> | ResponseError>
	>(url, {}, { validateStatus: () => true });

	const { status, data } = memberAwardResponse;

	if (status !== 201) throw new Error((data as ResponseError).error);
	return data as InsertOneResult<MemberAward>;
};
