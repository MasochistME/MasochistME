import axios, { AxiosResponse } from 'axios';

import { ResponseError } from 'v1/types';

/**
 * Calls API to update member's Steam data.
 *
 * Member is identified by their Steam ID.
 *
 * ## Usage
 *
 * ```ts
 * const memberId: string = "49i8675849302938457";
 * const { message } = await sdk.updateMember({ memberId });
 * ```
 *
 * @param params.memberId - ID of the member to update.
 */
export const updateMember = async (
	params: { memberId: string },
	/** @ignore */
	BASE_URL: string,
): Promise<{ message: string }> => {
	const { memberId } = params;
	const url = `${BASE_URL}/members/member/${memberId}/update`;

	const updateResponse = await axios.put<
		{ message: string } | ResponseError,
		AxiosResponse<{ message: string } | ResponseError>
	>(url, {}, { validateStatus: () => true });

	const { status, data } = updateResponse;

	if (status !== 202) throw new Error((data as ResponseError).error);
	return data as { message: string };
};
