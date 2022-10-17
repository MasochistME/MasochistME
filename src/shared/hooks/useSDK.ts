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

export const useBadges = () => {
	const { sdk } = useAppContext();

	const {
		data = [],
		isLoading,
		isFetched,
		isError,
	} = useQuery(['masochist', 'badges'], () => sdk.getBadgesList({}));

	return { data, isLoading, isFetched, isError };
};

export const useUserBadges = (steamId: string) => {
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
		data = [],
		isLoading,
		isFetched,
		isError,
	} = useQuery(['masochist', 'events'], () =>
		sdk.getEventsList({ filter: {}, limit: 50 }),
	);

	return { data, isLoading, isFetched, isError };
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
