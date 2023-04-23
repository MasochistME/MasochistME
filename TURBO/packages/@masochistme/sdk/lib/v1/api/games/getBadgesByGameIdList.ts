import axios, { AxiosResponse } from 'axios';

import { Badge, Sort, ResponseError } from 'v1/types';

/**
 * Returns a list of all badges assigned to a game with given ID (if it exists).
 *
 * Game is identified by its Steam ID.
 *
 * ### Filter options
 *
 * - `isLegacy` - filters by badge's `legacy` status,
 * - `isEnabled` - filters by badge's `enabled` status.
 *
 * ### Sort options
 *
 * - `points` - sorts by badge's point value.
 *
 * ## Usage
 *
 * ```ts
 * const gameId: number = 21645;
 * const badgesAll: Badge[] = await sdk.getBadgesByGameId({ gameId });
 * const badgePointsAsc: Badge[] = await sdk.getBadgesByGameId({ gameId, sort: { points: 'asc' }});
 * const badgesNonLegacy: Badge[] = await sdk.getBadgesByGameId({ gameId, filter: { isLegacy: false }});
 * ```
 *
 * // TODO currently this endpoint does not support non-Steam games as those don't have gameID.
 *
 * @param params.gameId - ID of the game which badges we want to retrieve.
 * @param params.filter - Filter to apply to returned badge list.
 * @param params.sort - Fields to sort badge list by.
 * @param params.limit - How many badges will get returned.
 */
export const getBadgesByGameIdList = async (
	params: BadgesByGameIdListParams,
	/** @ignore */
	BASE_URL: string,
): Promise<Badge[]> => {
	const { gameId, filter, sort, limit } = params;
	const url = `${BASE_URL}/games/game/${gameId}/badges/list`;

	const badgeResponse = await axios.post<
		Badge[] | ResponseError,
		AxiosResponse<Badge[] | ResponseError>
	>(url, { filter, sort, limit }, { validateStatus: () => true });

	const { status, data } = badgeResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as Badge[];
};

export type BadgesByGameIdListParams = {
	gameId: number;
	filter?: Partial<Pick<Badge, 'isEnabled' | 'isLegacy'>>;
	sort?: {
		[key in keyof Partial<Pick<Badge, 'points'>>]: Sort;
	};
	limit?: number;
};
