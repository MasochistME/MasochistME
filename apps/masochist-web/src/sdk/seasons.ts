import { SeasonsListParams } from '@masochistme/sdk/dist/v1/api/seasons';
import { useQuery } from '@tanstack/react-query';
import { useAppContext } from 'context';

/**
 *
 * @returns
 */
export const useSeasons = (params?: SeasonsListParams) => {
	const { sdk } = useAppContext();

	const {
		data: seasonsData = [],
		isLoading,
		isFetched,
		isError,
	} = useQuery(
		['masochist', 'seasons', params ? JSON.stringify(params) : ''],
		() => sdk.getSeasonsList({ ...(params ?? {}) }),
	);

	return { seasonsData, isLoading, isFetched, isError };
};

/**
 *
 * @returns
 */
export const useSeasonLeaderboards = ({ seasonId }: { seasonId?: string }) => {
	const { sdk } = useAppContext();

	return useQuery(
		['masochist', 'season', seasonId],
		// We can disable non-null assertion because of "enabled"
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		() => sdk.getSeasonLeaderboardsById({ seasonId: seasonId! }),
		{ enabled: !!seasonId },
	);
};
