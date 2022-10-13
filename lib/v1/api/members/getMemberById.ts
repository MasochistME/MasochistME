import axios, { AxiosResponse } from 'axios';

import { Member, MemberIdEither, ResponseError } from 'v1/types';

/**
 * Returns a member by either Steam ID or Discord ID, if it exists.
 * @category Members
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
