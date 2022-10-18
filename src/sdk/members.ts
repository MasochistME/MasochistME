import { useQuery } from '@tanstack/react-query';
import { useAppContext } from 'shared/store/context';

/**
 *
 */
export const useAllMembers = () => {
	const { sdk } = useAppContext();

	const {
		data: membersData = [],
		isLoading,
		isFetched,
		isError,
	} = useQuery(['masochist', 'members', 'all'], () => sdk.getMembersList({}));

	return { membersData, isLoading, isFetched, isError };
};

/**
 *
 */
export const useCuratorMembers = () => {
	const { sdk } = useAppContext();

	const {
		data: membersData = [],
		isLoading,
		isFetched,
		isError,
	} = useQuery(['masochist', 'members', 'curator'], () =>
		sdk.getMembersList({ filter: { isMember: true } }),
	);

	return { membersData, isLoading, isFetched, isError };
};

/**
 *
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
