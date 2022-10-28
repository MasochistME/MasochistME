import {
	GamesListParams,
	GameCompletionListParams,
} from '@masochistme/sdk/dist/v1/api/games';
import { Sort } from '@masochistme/sdk/dist/v1/types';
import { useQuery } from '@tanstack/react-query';
import { useAppContext } from 'context';

export const useGames = (params?: GamesListParams) => {
	const { sdk } = useAppContext();

	const {
		data: gamesData = [],
		isLoading,
		isFetched,
		isError,
	} = useQuery(
		['masochist', 'games', params ? JSON.stringify(params) : ''],
		() => sdk.getGamesList({ ...(params ?? {}) }),
	);

	return { gamesData, isLoading, isFetched, isError };
};

/**
 *
 */
export const useAllGames = () => {
	const { sdk } = useAppContext();

	const {
		data: gamesData = [],
		isLoading,
		isFetched,
		isError,
	} = useQuery(['masochist', 'games', 'all'], () =>
		sdk.getGamesList({
			sort: { title: 'asc' },
		}),
	);

	return { gamesData, isLoading, isFetched, isError };
};

/**
 *
 */
export const useCuratedGames = () => {
	const { sdk } = useAppContext();

	const {
		data: gamesData = [],
		isLoading,
		isFetched,
		isError,
	} = useQuery(['masochist', 'games', 'curated'], () =>
		sdk.getGamesList({
			filter: { isCurated: true },
			sort: { title: 'asc', tier: 'desc' },
		}),
	);

	return { gamesData, isLoading, isFetched, isError };
};

/**
 *
 */
export const useGameBadges = (gameId: number) => {
	const { sdk } = useAppContext();

	const {
		data: gameBadgesData = [],
		isLoading,
		isFetched,
		isError,
	} = useQuery(['masochist', 'games', gameId, 'badges'], () =>
		sdk.getBadgesByGameIdList({ gameId, sort: { points: 'desc' } }),
	);

	return { gameBadgesData, isLoading, isFetched, isError };
};

/**
 *
 */
export const useGameCompletions = (params?: GameCompletionListParams) => {
	const { sdk } = useAppContext();
	const fixedParams = {
		...params,
		sort: {
			mostRecentAchievementDate: 'asc' as Sort,
			completionPercentage: 'asc' as Sort,
			...(params?.sort && { ...params.sort }),
		},
	};

	const {
		data: completionsData = [],
		isLoading,
		isFetched,
		isError,
	} = useQuery(
		[
			'masochist',
			'games',
			'completions',
			fixedParams ? JSON.stringify(fixedParams) : '',
		],
		() => sdk.getGameCompletionList({ ...fixedParams }),
	);

	return { completionsData, isLoading, isFetched, isError };
};
