import axios, { AxiosResponse } from 'axios';
import { InsertOneResult } from 'mongodb';

import { Featured, ResponseError } from 'v1/types';

/**
 * Creates a new featured object.
 *
 * ## Usage
 *
 * ```ts
 * const featured: Omit<FeaturedVideo, 'date'> = {
 *  type: FeaturedType.VIDEO,
 *  memberId: "6547839284576",
 *  description: "Watch me die 7439578493e times in VVVVVV failed YOLO attempt",
 *  link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
 *  gameId: 70300,
 *  gameTitle: null,
 *  gameLink: null,
 * };
 *
 * const {
 * 	acknowledged,
 * 	insertedId,
 * } = await sdk.createFeatured({ featured });
 * ```
 *
 * @param params.featured - Data of the new featured object.
 */
export const createFeatured = async (
	params: {
		featured: Omit<
			Featured,
			'_id' | 'date' | 'isApproved' | 'isVisible' | 'isSticky'
		>;
	},
	/** @ignore */
	BASE_URL: string,
): Promise<InsertOneResult<Featured>> => {
	const { featured } = params;
	const url = `${BASE_URL}/featured`;

	const featuredResponse = await axios.post<
		InsertOneResult<Featured> | ResponseError,
		AxiosResponse<InsertOneResult<Featured> | ResponseError>,
		Omit<Featured, '_id' | 'date' | 'isApproved' | 'isVisible' | 'isSticky'>
	>(url, featured, { validateStatus: () => true });

	const { status, data } = featuredResponse;

	if (status !== 201) throw new Error((data as ResponseError).error);
	return data as InsertOneResult<Featured>;
};
