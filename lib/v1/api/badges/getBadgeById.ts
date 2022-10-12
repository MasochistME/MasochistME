import axios, { AxiosResponse } from 'axios';

import { Badge, ResponseError } from 'v1/types';

/**
 * Returns a badge by given ID, if it exists.
 * @param badgeId string
 * @returns Badge
 */
export const getRaceById = async (
	{ badgeId }: { badgeId: string },
	BASE_URL: string,
): Promise<Badge> => {
	const url = `${BASE_URL}/badges/badge/${badgeId}`;

	const badgeResponse = await axios.get<
		Badge | ResponseError,
		AxiosResponse<Badge | ResponseError>
	>(url, { validateStatus: () => true });

	const { status, data } = badgeResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as Badge;
};
