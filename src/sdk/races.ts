import { RaceListParams } from '@masochistme/sdk/dist/v1/api/races';
import { SeasonsListParams } from '@masochistme/sdk/dist/v1/api/seasons';
import { useQuery } from '@tanstack/react-query';
import { useAppContext } from 'context';

/**
 *
 * @returns
 */
export const useRaces = (params?: RaceListParams) => {
	const { sdk } = useAppContext();

	const {
		data: racesData = [],
		isLoading,
		isFetched,
		isError,
	} = useQuery(
		['masochist', 'races', params ? JSON.stringify(params) : ''],
		() => sdk.getRaceList({ ...(params ?? {}) }),
	);

	return { racesData, isLoading, isFetched, isError };
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
		() => sdk.getRaceById({ raceId: raceId! }),
		{ enabled: !!raceId },
	);

	return { raceData, isLoading, isFetched, isError };
};

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
