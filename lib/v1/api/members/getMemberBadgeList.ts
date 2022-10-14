import axios, { AxiosResponse } from 'axios';

import { Badge, MemberIdEither, ResponseError } from 'v1/types';

/**
 * Returns a list of all badges belonging to a member.
 * Member can be identified by either Discord ID or Steam ID, but at least one of those values **must** be provided.
 *
 * ## Usage
 *
 * ```ts
 * const steamId: string = "567876545678";
 * const badges: Badge[] = await sdk.getMemberBadgeList({ steamId });
 * ```
 *
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
