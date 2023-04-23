import axios, { AxiosResponse } from 'axios';

import { Featured, Sort, ResponseError } from 'v1/types';

/**
 * Returns a list of all featured objects.
 *
 * ### Filter options
 *
 * - `type` - filter by type of the featured object,
 * - `memberId` - filter by ID of the member who posted it,
 * - `gameId` - filter by ID of the linked game,
 * - `gameTitle` - filter by title of the linked game,
 * - `from` - filter by being newer than a specified date,
 * - `to` - filter by being older than a specified date.
 *
 * ### Sort options
 *
 * - `date` - sorts by date of posting.
 *
 * ## Usage
 *
 * ```ts
 * const featuredAll: Featured[] = await sdk.getFeaturedList({ });
 * const featuredVideos: Featured[] = await sdk.getFeaturedList({ filter: { type: FeaturedType.VIDEO }});
 * const featuredLastWeek: Featured[] =
 * 	await sdk.getFeaturedList({ sort: { from: 2019-07-07T16:38:19.000+00:00 }});
 * ```
 *
 * @param params.filter - Filter to apply to returned featured list.
 * @param params.sort - Fields to sort featured list by.
 * @param params.limit - How many featured objects will get returned.
 */
export const getFeaturedList = async (
	params: FeaturedListParams,
	/** @ignore */
	BASE_URL: string,
): Promise<Featured[]> => {
	const { filter, sort, limit } = params;
	const url = `${BASE_URL}/featured/list`;

	const featuredResponse = await axios.post<
		Featured[] | ResponseError,
		AxiosResponse<Featured[] | ResponseError>
	>(url, { filter, sort, limit }, { validateStatus: () => true });

	const { status, data } = featuredResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as Featured[];
};

export type FeaturedListParams = {
	filter?: Partial<
		Pick<
			Featured,
			| 'type'
			| 'memberId'
			| 'gameId'
			| 'gameTitle'
			| 'isApproved'
			| 'isVisible'
			| 'isSticky'
		> & {
			from?: Date;
			to?: Date;
		}
	>;
	sort?: {
		[key in keyof Partial<Pick<Featured, 'date'>>]: Sort;
	};
	limit?: number;
};
