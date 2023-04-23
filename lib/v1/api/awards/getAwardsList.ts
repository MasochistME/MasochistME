import axios, { AxiosResponse } from 'axios';

import { Award, /* Sort, */ ResponseError } from 'v1/types';

/**
 * Returns a list of all awards.
 *
 * ### Filter options
 *
 * - `category` - filters by the category that award belongs to,
 * - `isLegacy` - filters by award's `legacy` status,
 * - `isEnabled` - filters by award's `enabled` status.
 *
 * ### Sort options
 *
 * None so far!
 *
 * ## Usage
 *
 * ```ts
 * const awardsAll: Award[] = await sdk.getAwardsList({ });
 * ```
 *
 * @param params.filter - Filter to apply to returned award list.
 * @param params.sort - Fields to sort award list by.
 * @param params.limit - How many awards will get returned.
 */
export const getAwardsList = async (
	params: AwardsListParams,
	/** @ignore */
	BASE_URL: string,
): Promise<Award[]> => {
	const { filter, sort, limit } = params;
	const url = `${BASE_URL}/awards/list`;

	const awardResponse = await axios.post<
		Award[] | ResponseError,
		AxiosResponse<Award[] | ResponseError>
	>(url, { filter, sort, limit }, { validateStatus: () => true });

	const { status, data } = awardResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as Award[];
};

export type AwardsListParams = {
	filter?: Partial<Pick<Award, 'category' | 'isEnabled' | 'isLegacy'>>;
	sort?: {
		// TODO Sorting is not used for awards yet!
		// [key in keyof Partial<Pick<Award, 'TODO'>>]: Sort;
	};
	limit?: number;
};
