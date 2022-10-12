import axios, { AxiosResponse } from 'axios';

import { Badge, ResponseError } from 'v1/types';

/**
 * Returns a list of all badges belonging to member with given ID.
 * @param memberId string
 * @returns Badge[]
 */
export const getMemberBadgeList = async (
	{ memberId }: { memberId: string },
	BASE_URL: string,
): Promise<Badge[]> => {
	const url = `${BASE_URL}/members/member/${memberId}/badges/list`;

	const badgeResponse = await axios.get<
		Badge[] | ResponseError,
		AxiosResponse<Badge[] | ResponseError>
	>(url, { validateStatus: () => true });

	const { status, data } = badgeResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as Badge[];
};
