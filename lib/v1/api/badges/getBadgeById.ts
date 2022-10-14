import axios, { AxiosResponse } from 'axios';

import { Badge, ResponseError } from 'v1/types';

/**
 * Retrieve a badge with given ID (if it exists).
 *
 * Badge is identified by its stringified `ObjectID`.
 *
 * ## Usage
 *
 * ```ts
 * const bagdeId: string = "5f5e555d5a578b6";
 * const badge: Badge = await sdk.getBadgeById({ badgeId });
 * ```
 *
 * @param params.badgeId - ID of the badge to fetch.
 */
export const getBadgeById = async (
	params: { badgeId: string },
	/** @ignore */
	BASE_URL: string,
): Promise<Badge> => {
	const { badgeId } = params;
	const url = `${BASE_URL}/badges/badge/${badgeId}`;

	const badgeResponse = await axios.get<
		Badge | ResponseError,
		AxiosResponse<Badge | ResponseError>
	>(url, { validateStatus: () => true });

	const { status, data } = badgeResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as Badge;
};
