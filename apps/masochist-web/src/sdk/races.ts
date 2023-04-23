import { RaceListParams } from '@masochistme/sdk/dist/v1/api/races';
import { useQuery } from '@tanstack/react-query';
import { useAppContext } from 'context';

/**
 *
 * @returns
 */
export const useRaces = (params?: RaceListParams) => {
	const { sdk } = useAppContext();

	return useQuery(
		['masochist', 'races', params ? JSON.stringify(params) : ''],
		() => sdk.getRaceList({ ...(params ?? {}) }),
	);
};

/**
 *
 * @returns
 */
export const useRaceById = (raceId?: string | null) => {
	const { sdk } = useAppContext();

	const {
		data: raceData,
		isLoading,
		isFetched,
		isError,
	} = useQuery(
		['masochist', 'race', raceId],
		// We can disable non-null assertion because of "enabled"
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		() => sdk.getRaceById({ raceId: raceId! }),
		{ enabled: !!raceId },
	);

	return { raceData, isLoading, isFetched, isError };
};
