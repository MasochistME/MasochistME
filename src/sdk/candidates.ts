import { useQuery } from '@tanstack/react-query';
import { useAppContext } from 'context';

export const useCandidateSummary = (steamUrl: string) => {
	const { sdk } = useAppContext();

	const {
		data: candidateData,
		isLoading,
		isFetched,
		isError,
	} = useQuery(['masochist', 'candidate', steamUrl], () =>
		sdk.getCandidateSummary({ steamUrl }),
	);

	return { candidateData, isLoading, isFetched, isError };
};
