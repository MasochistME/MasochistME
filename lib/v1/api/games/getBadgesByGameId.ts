import axios, { AxiosResponse } from 'axios';

import { Badge, ResponseError } from 'v1/types';

/**
 * Returns a list of all badges belonging to a game with given ID.
 * @category Games
 * @param params.gameId - ID of the game which badges we want to retrieve.
 */
export const getBadgesByGameId = async (
	params: { gameId: string },
	/** @ignore */
	BASE_URL: string,
): Promise<Badge[]> => {
	const { gameId } = params;
	const url = `${BASE_URL}/games/game/${gameId}/badges/list`;

	const badgeResponse = await axios.get<
		Badge[] | ResponseError,
		AxiosResponse<Badge[] | ResponseError>
	>(url, { validateStatus: () => true });

	const { status, data } = badgeResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as Badge[];
};
