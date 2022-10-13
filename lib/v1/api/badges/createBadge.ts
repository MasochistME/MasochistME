/** @module Badges */

import { InsertOneResult } from 'mongodb';
import axios, { AxiosResponse } from 'axios';

import { Badge, ResponseError } from 'v1/types';

/**
 * Creates a new badge.
 *
 * @category Badges
 * @function
 *
 * @param   {Omit<Badge, '_id'>}      badge  Body of a new badge.
 * @return  {InsertOneResult<Badge>}         MongoDB insert one result object.
 */
export const createBadge = async (
	{ badge }: { badge: Omit<Badge, '_id'> },
	BASE_URL: string,
): Promise<InsertOneResult<Badge>> => {
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
