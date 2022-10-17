import { useQuery } from '@tanstack/react-query';
import { useAppContext } from 'shared/store/context';

export const useMembers = () => {
	const { sdk } = useAppContext();

	const {
		data: membersData = [],
		isLoading,
		isFetched,
		isError,
	} = useQuery(['masochist', 'members'], () =>
		sdk.getMembersList({ filter: { isMember: true } }),
	);

	return { membersData, isLoading, isFetched, isError };
};

export const useGames = () => {
	const { sdk } = useAppContext();

	const {
		data: gamesData = [],
		isLoading,
		isFetched,
		isError,
	} = useQuery(['masochist', 'games'], () =>
		sdk.getGamesList({
			filter: { isCurated: true, isProtected: true },
			sort: {
				tier: 'desc',
				title: 'asc',
			},
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

export const useBadges = () => {
	const { sdk } = useAppContext();

	const {
		data: badgesData = [],
		isLoading,
		isFetched,
		isError,
	} = useQuery(['masochist', 'badges'], () => sdk.getBadgesList({}));

	return { badgesData, isLoading, isFetched, isError };
};

export const useMemberBadges = (steamId: string) => {
	const { sdk } = useAppContext();

	const {
		data: memberBadgeData = [],
		isLoading,
		isFetched,
		isError,
	} = useQuery(['masochist', 'member', steamId, 'badges'], () =>
		sdk.getMemberBadgeList({ steamId }),
	);

	return { memberBadgeData, isLoading, isFetched, isError };
};

export const useEvents = () => {
	const { sdk } = useAppContext();

	const {
		data: eventsData = [],
		isLoading,
		isFetched,
		isError,
	} = useQuery(['masochist', 'events'], () =>
		sdk.getEventsList({ filter: {}, limit: 50 }),
	);

	return { eventsData, isLoading, isFetched, isError };
};

export const useTiers = () => {
	const { sdk } = useAppContext();

	const {
		data: tiersData = [],
		isLoading,
		isFetched,
		isError,
	} = useQuery(['masochist', 'tiers'], () => sdk.getTiersList({}));

	return { tiersData, isLoading, isFetched, isError };
};
