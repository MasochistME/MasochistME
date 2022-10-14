import axios, { AxiosResponse } from 'axios';

import { Tier, ResponseError } from 'v1/types';

/**
 * Returns a list of all game tiers.
 *
 * ## Usage
 *
 * ```ts
 * const tiers: Tier[] = await sdk.getTiersList();
 * ```
 *
 * @category Tiers
 */
export const getTiersList = async (
	/** @ignore */
	BASE_URL: string,
): Promise<Tier[]> => {
	const url = `${BASE_URL}/tiers/list`;

	const tierResponse = await axios.get<
		Tier[] | ResponseError,
		AxiosResponse<Tier[] | ResponseError>
	>(url, { validateStatus: () => true });

	const { status, data } = tierResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as Tier[];
};
