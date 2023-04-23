import axios, { AxiosResponse } from 'axios';

import { Game, Sort, ResponseError } from 'v1/types';

/**
 * Returns a list of all games.
 *
 * ### Filter options
 *
 * - `tier` - filters by game tier,
 * - `isCurated` - filters by game's Steam curation status.
 *
 * ### Sort options
 *
 * - `tier` - sorts by game tier,
 * - `achievementsTotal` - sorts by game's number of achievements.
 *
 * ## Usage
 *
 * ```ts
 * const gamesAll: Game[] = await sdk.getGamesList({ });
 * const gamesByTier: Game[] = await sdk.getGamesList({ sort: { tier: 'asc' }});
 * const gamesCurated: Game[] = await sdk.getGamesList({ filter: { isCurated: true }});
 * ```
 *
 * @param params.filter - Filter to apply to returned game list.
 * @param params.sort - Fields to sort game list by.
 * @param params.limit - How many games will get returned.
 */
export const getGamesList = async (
	params: GamesListParams,
	/** @ignore */
	BASE_URL: string,
): Promise<Game[]> => {
	const { filter, sort, limit } = params;
	const url = `${BASE_URL}/games/list`;

	const gamesResponse = await axios.post<
		Game[] | ResponseError,
		AxiosResponse<Game[] | ResponseError>
	>(url, { filter, sort, limit }, { validateStatus: () => true });

	const { status, data } = gamesResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as Game[];
};

export type GamesListParams = {
	filter?: Partial<Pick<Game, 'tier' | 'isCurated'>> & { sale?: boolean };
	sort?: {
		[key in keyof Partial<
			Pick<Game, 'title' | 'tier' | 'achievementsTotal' | 'sale'>
		>]: Sort;
	};
	limit?: number;
};
