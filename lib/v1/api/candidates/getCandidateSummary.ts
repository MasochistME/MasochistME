import axios, { AxiosResponse } from 'axios';

import { Candidate, ResponseError } from 'v1/types';

/**
 * Returns a summary of a Steam user, if they exist.
 * User is identified by their profile's URL. Can be either ID profile of PROFILES profile.
 * Does not have to be a MasochistME member.
 *
 * ## Usage
 *
 * ```ts
 * const steamUrl: string = "https://steamcommunity.com/id/ARCYVILK";
 * const candidate: Candidate[] = await sdk.getCandidateSummary({ steamUrl });
 * ```
 *
 * @param params.steamId   - (Optional) Steam ID of the requested member.
 * @param params.discordId - (Optional) Discord ID of the requested member.
 */
export const getCandidateSummary = async (
	params: CandidateSummaryParams,
	/** @ignore */
	BASE_URL: string,
): Promise<Candidate> => {
	const { steamUrl } = params;
	const url = `${BASE_URL}/candidate/scout`;

	const candidateResponse = await axios.post<
		Candidate | ResponseError,
		AxiosResponse<Candidate | ResponseError>
	>(url, { steamUrl }, { validateStatus: () => true });

	const { status, data } = candidateResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as Candidate;
};

export type CandidateSummaryParams = {
	steamUrl: string;
};
