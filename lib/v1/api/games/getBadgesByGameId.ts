import axios, { AxiosResponse } from 'axios';

import { Badge, ResponseError } from 'v1/types';

/**
 * Returns a list of all badges belonging to a game with given ID.
 * @param gameId string
 * @returns Badge[]
 */
export const getBadgesByGameId = async (
	{ gameId }: { gameId: string },
	BASE_URL: string,
): Promise<Badge[]> => {
	const url = `${BASE_URL}/game/${gameId}/badges/list`;

	const badgeResponse = await axios.get<
		Badge[] | ResponseError,
		AxiosResponse<Badge[] | ResponseError>
	>(url, { validateStatus: () => true });

	const { status, data } = badgeResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as Badge[];
};
