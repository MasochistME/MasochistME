import { useQuery } from '@tanstack/react-query';
import { useAppContext } from 'shared/store/context';

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
			sort: { title: 'asc' },
		}),
	);

	return { gamesData, isLoading, isFetched, isError };
};

export const useGameBadges = (gameId: number) => {
	const { sdk } = useAppContext();

	const {
		data: gameBadgesData = [],
		isLoading,
		isFetched,
		isError,
	} = useQuery(['masochist', 'games', gameId, 'badges'], () =>
		sdk.getBadgesByGameIdList({ gameId }),
	);

	return { gameBadgesData, isLoading, isFetched, isError };
};
