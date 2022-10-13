import axios, { AxiosResponse } from 'axios';
import { InsertOneResult } from 'mongodb';

import { Badge, ResponseError } from 'v1/types';

/**
 * Creates a new badge.
 * @category Badges
 * @param params.badge - Data of the new badge. All fields of the type Badge are required.
 */
export const createBadge = async (
	params: { badge: Omit<Badge, '_id'> },
	/** @ignore */
	BASE_URL: string,
): Promise<InsertOneResult<Badge>> => {
	const { badge } = params;
	const url = `${BASE_URL}/badges`;

	const badgeResponse = await axios.post<
		InsertOneResult<Badge> | ResponseError,
		AxiosResponse<InsertOneResult<Badge> | ResponseError>,
		Omit<Badge, '_id'>
	>(url, badge, { validateStatus: () => true });

	const { status, data } = badgeResponse;

	if (status !== 201) throw new Error((data as ResponseError).error);
	return data as InsertOneResult<Badge>;
};
