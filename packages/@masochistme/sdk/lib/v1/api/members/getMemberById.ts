import axios, { AxiosResponse } from 'axios';

import { Member, MemberIdEither, ResponseError } from 'v1/types';

/**
 * Returns a member, if they exist.
 * Member can be identified by either Discord ID or Steam ID, but at least one of those values **must** be provided.
 *
 * ## Usage
 *
 * ```ts
 * const steamId: string = "567876545678";
 * const member: Member = await sdk.getMemberById({ steamId });
 * ```
 *
 * @param params.steamId   - (Optional) Steam ID of the requested member.
 * @param params.discordId - (Optional) Discord ID of the requested member.
 */
export const getMemberById = async (
	params: MemberIdEither,
	/** @ignore */
	BASE_URL: string,
): Promise<Member> => {
	const { steamId, discordId } = params;
	const memberId = steamId ?? discordId;
	const url = `${BASE_URL}/members/member/${memberId}`;

	const memberResponse = await axios.get<
		Member | ResponseError,
		AxiosResponse<Member | ResponseError>
	>(url, { validateStatus: () => true });

	const { status, data } = memberResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as Member;
};
