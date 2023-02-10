import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ResponseError, TierId } from '@masochistme/sdk/dist/v1/types';
import axios, { AxiosResponse } from 'axios';

// import { useAppContext } from 'context';

/**
 *
 */
const BASE_URL = 'http://localhost:3081/api/v1';
export const useCandidateSummary = (steamName: string) => {
	// const { sdk } = useAppContext();
	const queryKey = ['masochist', 'candidate', steamName];

	return useQuery(
		queryKey,
		() => getCandidateSummary({ steamName }, BASE_URL),
		{
			enabled: !!steamName,
		},
	);
};

/********************************
 *                              *
 *       THIS GOES TO SDK       *
 *                              *
 ********************************/
const getCandidateSummary = async (
	params: CandidateSummaryParams,
	/** @ignore */
	BASE_URL: string,
): Promise<CandidateGame[]> => {
	const { steamName } = params;
	const url = `${BASE_URL}/candidate/${steamName}/scout`;

	const candidateResponse = await axios.get<
		CandidateGame[] | ResponseError,
		AxiosResponse<CandidateGame[] | ResponseError>
	>(url, { validateStatus: () => true });

	const { status, data } = candidateResponse;

	if (status !== 200) throw new Error((data as ResponseError).error);
	return data as CandidateGame[];
};
type CandidateSummaryParams = {
	steamName: string;
};
type CandidateGame = {
	id: number;
	title: string;
	tier: TierId;
	pts: number;
};
