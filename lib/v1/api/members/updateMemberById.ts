import axios, { AxiosResponse } from 'axios';
import { UpdateResult } from 'mongodb';

import { Member, ResponseError } from 'v1/types';

type MemberUpdate = Partial<Pick<Member, 'description' | 'discordId'>>;

/**
 * Updates a member by given member ID.
 *
 * Member is identified by their Discord ID.
 *
 * ### Updatable fields
 * - `description`
 *
 * ## Usage
 *
 * ```ts
 * const memberId: string = "2938274356793";
 * const member: Member = {
 * 	description: "Lorem ipsum dolor sit amet.",
 * };
 *
 * const {
 * 	acknowledged,
 * 	matchedCount,
 * 	modifiedCount,
 * 	upsertedCount,
 * 	upsertedId,
 * } = await sdk.updateMemberById({ memberId, member });
 * ```
 *
 * @param params.memberId - ID of the member to update.
 * @param params.member   - Fields to be updated for selected member.
 */
export const updateMemberById = async (
	params: { member: MemberUpdate; memberId: string },
	/** @ignore */
	BASE_URL: string,
): Promise<UpdateResult> => {
	const { member, memberId } = params;
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
