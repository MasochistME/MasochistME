import axios, { AxiosResponse } from 'axios';

import { PatreonTier, ResponseError } from 'v1/types';

/**
 * Returns a list of all Patreon tiers.
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
export const getPatreonTierList = async (
	/** @ignore */
	BASE_URL: string,
): Promise<PatreonTier[]> => {
	const url = `${BASE_URL}/patrons/tiers/list`;

	const response = await axios.get<
		PatreonTier[] | ResponseError,
		AxiosResponse<PatreonTier[] | ResponseError>
	>(url, { validateStatus: () => true });

	const { status, data } = response;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as PatreonTier[];
};
