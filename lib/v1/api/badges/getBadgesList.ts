import axios, { AxiosResponse } from 'axios';

import { Badge, ResponseError } from 'v1/types';

/**
 * Returns a list of all badges.
 *
 * ## Usage
 *
 * ```ts
 * const badges: Badge[] = await sdk.getBadgesList();
 * ```
 *
 */
export const getBadgesList = async (
	/** @ignore */
	BASE_URL: string,
): Promise<Badge[]> => {
	const url = `${BASE_URL}/badges/list`;

	const badgeResponse = await axios.get<
		Badge[] | ResponseError,
		AxiosResponse<Badge[] | ResponseError>
	>(url, { validateStatus: () => true });

	const { status, data } = badgeResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as Badge[];
};
