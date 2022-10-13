/** @module Tiers */

import axios, { AxiosResponse } from 'axios';

import { Tier, ResponseError } from 'v1/types';

/**
 * Returns a list of all tiers.
 *
 * @category Tiers
 * @function
 *
 * @return  {Tier[]}  List of all tiers.
 */
export const getTiersList = async (BASE_URL: string): Promise<Tier[]> => {
	const url = `${BASE_URL}/tiers/list`;

	const tierResponse = await axios.get<
		Tier[] | ResponseError,
		AxiosResponse<Tier[] | ResponseError>
	>(url, { validateStatus: () => true });

	const { status, data } = tierResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as Tier[];
};
