import axios, { AxiosResponse } from 'axios';

import { Update, ResponseError } from 'v1/types';

/**
 * Get a curator update status.
 *
 * ## Usage
 *
 * ```ts
 * const {isUpdating}: Update = await sdk.getUpdateStatus();
 * ```
 *
 * @param params.badgeId - ID of the badge to fetch.
 */
export const getUpdateStatus = async (
	/** @ignore */
	BASE_URL: string,
): Promise<Update> => {
	const url = `${BASE_URL}/update`;

	const response = await axios.get<
		Update | ResponseError,
		AxiosResponse<Update | ResponseError>
	>(url, { validateStatus: () => true });

	const { status, data } = response;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as Update;
};
