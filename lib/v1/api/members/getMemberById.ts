import axios, { AxiosResponse } from 'axios';

import { Member, MemberIdEither, ResponseError } from 'v1/types';

/**
 * Returns a member by either Steam ID or Discord ID, if it exists.
 *
 * @category Members
 * @function
 *
 * @param   {String | Never}  steamId    Steam ID of the requested member.
 * @param   {String | Never}  discordId  Discord ID of the requested member.
 * @return 	{Member}										 Requested member's data.
 */
export const getMemberById = async (
	{ steamId, discordId }: MemberIdEither,
	BASE_URL: string,
): Promise<Member> => {
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
