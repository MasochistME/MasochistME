import axios, { AxiosResponse } from 'axios';

import { Badge, MemberIdEither, ResponseError } from 'v1/types';

/**
 * Returns a list of all badges belonging to member with either Steam ID or Discord ID.
 * @category Members
 * @param params.steamId   - (Optional) Steam ID of the requested member.
 * @param params.discordId - (Optional) Discord ID of the requested member.
 */
export const getMemberBadgeList = async (
	params: MemberIdEither,
	/** @ignore */
	BASE_URL: string,
): Promise<Badge[]> => {
	const { steamId, discordId } = params;
	const memberId = steamId ?? discordId;
	const url = `${BASE_URL}/members/member/${memberId}/badges/list`;

	const badgeResponse = await axios.get<
		Badge[] | ResponseError,
		AxiosResponse<Badge[] | ResponseError>
	>(url, { validateStatus: () => true });

	const { status, data } = badgeResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as Badge[];
};

// TODO
// think if it should return just the MemberBadge[], or actual Badge[]
