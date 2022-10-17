import { useQuery } from '@tanstack/react-query';
import { useAppContext } from 'shared/store/context';

/**
 *
 * @returns
 */
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

/**
 *
 * @param steamId
 * @returns
 */
export const useMemberBadges = (steamId: string) => {
	const { sdk } = useAppContext();

	const {
		data: memberBadgeData = [],
		isLoading,
		isFetched,
		isError,
	} = useQuery(
		['masochist', 'member', steamId, 'badges'],
		() => sdk.getMemberBadgeList({ steamId }),
		{ enabled: !!steamId },
	);

	return { memberBadgeData, isLoading, isFetched, isError };
};

/**
 *
 * @param steamId
 * @returns
 */
// TODO
// export const useMemberGames = (steamId: string) => {
// 	const { sdk } = useAppContext();

// 	const {
// 		data: memberGameData = [],
// 		isLoading,
// 		isFetched,
// 		isError,
// 	} = useQuery(['masochist', 'member', steamId, 'games'], () =>
// 		sdk.getMembersGameList({ steamId }),
// 	);

// 	return { memberGameData, isLoading, isFetched, isError };
// };

/**
 *
 * @param limit
 * @returns
 */
export const useLeaderboards = (limit?: number) => {
	const { sdk } = useAppContext();

	const {
		data: leaderboardsData = [],
		isLoading,
		isFetched,
		isError,
	} = useQuery(['masochist', 'leaderboards', `limit-${limit ?? 1000}`], () =>
		sdk.getLeaderboardsList({ limit: limit ?? 1000 }),
	);

	return { leaderboardsData, isLoading, isFetched, isError };
};

/**
 *
 * @param limit
 * @returns
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
