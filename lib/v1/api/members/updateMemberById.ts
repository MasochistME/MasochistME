import axios, { AxiosResponse } from 'axios';
import { UpdateResult } from 'mongodb';

import { Member, ResponseError } from 'v1/types';

type MemberParams =
	| { steamId: string; discordId: never }
	| { steamId: never; discordId: string };
type MemberUpdate = Partial<Pick<Member, 'description'>>;
/**
 * Updates a member by updating the fields that the user had passed.
 * @param member MemberUpdate
 * @param steamId string | never
 * @param discordId string | never
 * @returns UpdateResult
 */
export const updateMemberById = async (
	{ member, steamId, discordId }: { member: MemberUpdate } & MemberParams,
	BASE_URL: string,
): Promise<UpdateResult> => {
	const memberId = steamId ?? discordId;
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
