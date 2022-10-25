import { useQuery } from '@tanstack/react-query';
import { useAppContext } from 'context';

/**
 *
 */
export const useLeaderboardsMembers = (limit?: number) => {
	const { sdk } = useAppContext();

	const {
		data: leaderboardsData = [],
		isLoading,
		isFetched,
		isError,
	} = useQuery(
		['masochist', 'leaderboards', 'members', `limit-${limit ?? 1000}`],
		() =>
			sdk.getLeaderboardsMembersList({
				filter: { isMember: true },
				limit: limit ?? 1000,
			}),
	);

	return { leaderboardsData, isLoading, isFetched, isError };
};

/**
 *
 */
export const useLeaderboardsGames = (limit?: number) => {
	const { sdk } = useAppContext();

	const {
		data: leaderboardsData = [],
		isLoading,
		isFetched,
		isError,
	} = useQuery(
		['masochist', 'leaderboards', 'games', `limit-${limit ?? 1000}`],
		() => sdk.getLeaderboardsGamesList({}),
	);

	return { leaderboardsData, isLoading, isFetched, isError };
};

/**
 *
 */
export const useMemberLeaderboards = (steamId?: string) => {
	const { sdk } = useAppContext();

	const {
		data: leaderData,
		isLoading,
		isFetched,
		isError,
	} = useQuery(
		['masochist', 'leaderboards', steamId],
		() => sdk.getMemberLeaderboardsPositionById({ memberId: steamId! }),
		{ enabled: !!steamId },
	);

	return { leaderData, isLoading, isFetched, isError };
};
