import axios, { AxiosResponse } from 'axios';

import { Badge, Sort, ResponseError } from 'v1/types';

/**
 * Returns a list of all badges.
 *
 * ### Filter options
 *
 * - `gameId` - filters by ID of the Steam game the badge belongs to,
 * - `title` - filters by title of the non-Steam game the badge belongs to,
 * - `isSteamGame` - filters by game being on Steam or not,
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
 * const badgesAll: Badge[] = await sdk.getBadgesList({ });
 * const badgePointsAsc: Badge[] = await sdk.getBadgesList({ sort: { points: 'asc' }});
 * const badgesSteamGames: Badge[] = await sdk.getBadgesList({ filter: { isSteamGame: true }});
 * ```
 *
 * @param params.filter - Filter to apply to returned badge list.
 * @param params.sort - Fields to sort badge list by.
 * @param params.limit - How many badges will get returned.
 */
export const getBadgesList = async (
	params: BadgesListParams,
	/** @ignore */
	BASE_URL: string,
): Promise<Badge[]> => {
	const { filter, sort, limit } = params;
	const url = `${BASE_URL}/badges/list`;

	const badgeResponse = await axios.post<
		Badge[] | ResponseError,
		AxiosResponse<Badge[] | ResponseError>
	>(url, { filter, sort, limit }, { validateStatus: () => true });

	const { status, data } = badgeResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as Badge[];
};

export type BadgesListParams = {
	filter?: Partial<
		Pick<Badge, 'gameId' | 'title' | 'isEnabled' | 'isLegacy' | 'isSteamGame'>
	>;
	sort?: {
		[key in keyof Partial<Pick<Badge, 'points'>>]: Sort;
	};
	limit?: number;
};
