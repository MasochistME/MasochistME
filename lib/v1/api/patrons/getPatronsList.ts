import axios, { AxiosResponse } from 'axios';

import { Patron, Sort, ResponseError } from 'v1/types';

/**
 * Returns a list of all patrons.
 *
 * ### Filter options
 *
 * - `tier` - filter by tier of the patron.
 *
 * ### Sort options
 *
 * - `tier` - sort by tier of the patron.
 *
 * ## Usage
 *
 * ```ts
 * const patronsAll: Featured[] = await sdk.getPatronsList({ });
 * const patronsTier4: Featured[] =
 * 	await sdk.getPatronsList({ filter: { tier: PatronTier.TIER4 }});
 * ```
 *
 * @param params.filter - Filter to apply to returned patrons list.
 * @param params.sort - Fields to sort patrons list by.
 * @param params.limit - How many patrons will get returned.
 */
export const getPatronsList = async (
	params: PatronListParams,
	/** @ignore */
	BASE_URL: string,
): Promise<Patron[]> => {
	const { filter, sort, limit } = params;
	const url = `${BASE_URL}/patrons/list`;

	const featuredResponse = await axios.post<
		Patron[] | ResponseError,
		AxiosResponse<Patron[] | ResponseError>
	>(url, { filter, sort, limit }, { validateStatus: () => true });

	const { status, data } = featuredResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as Patron[];
};

export type PatronListParams = {
	filter?: Partial<Pick<Patron, 'tier'>>;
	sort?: {
		[key in keyof Partial<Pick<Patron, 'tier'>>]: Sort;
	};
	limit?: number;
};
