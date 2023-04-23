import axios, { AxiosResponse } from 'axios';

import { Leaderboards, ResponseError } from 'v1/types';

/**
 * Returns leaderboards statistics of a selected member.
 *
 * Member is identified by their Steam ID.
 *
 * ## Usage
 *
 * ```ts
 * const memberId: string = '6578987654567';
 * const memberLeaderboards: Leaderboards = await sdk.getMemberLeaderboardsPositionById({ memberId });
 * ```
 *
 * @param params.memberId - Steam ID of the member whose leaderboards position we want to check.
 */
export const getMemberLeaderboardsPositionById = async (
	params: { memberId: string },
	/** @ignore */
	BASE_URL: string,
): Promise<Leaderboards> => {
	const { memberId } = params;
	const url = `${BASE_URL}/leaderboards/member/${memberId}`;

	const leaderboardsResponse = await axios.get<
		Leaderboards | ResponseError,
		AxiosResponse<Leaderboards | ResponseError>
	>(url, { validateStatus: () => true });

	const { status, data } = leaderboardsResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as Leaderboards;
};
