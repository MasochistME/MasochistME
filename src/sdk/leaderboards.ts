import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getTimePeriod } from 'utils/getTimePeriod';
import { useAppContext } from 'context';

/**
 *
 */
export const useLeaderboardsMembers = (limit?: number) => {
	const { sdk, queryLeaderboardPeriod } = useAppContext();
	const fixedDateFrom = useMemo(
		() => getTimePeriod(queryLeaderboardPeriod),
		[queryLeaderboardPeriod],
	);

	const {
		data: leaderboardsData = [],
		isLoading,
		isFetched,
		isError,
		error,
	} = useQuery(
		[
			'masochist',
			'leaderboards',
			'members',
			`limit-${limit ?? 1000}`,
			`dateFrom-${fixedDateFrom}`,
		],
		() =>
			sdk.getLeaderboardsMembersList({
				filter: {
					isMember: true,
					...(fixedDateFrom && { from: new Date(fixedDateFrom) }),
				},
				limit: limit ?? 1000,
			}),
	);

	if (isError) throw error;

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
		error,
	} = useQuery(
		['masochist', 'leaderboards', 'games', `limit-${limit ?? 1000}`],
		() => sdk.getLeaderboardsGamesList({}),
	);

	if (isError) throw error;

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
		error,
	} = useQuery(
		['masochist', 'leaderboards', steamId],
		// We can disable non-null assertion because of "enabled"
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		() => sdk.getMemberLeaderboardsPositionById({ memberId: steamId! }),
		{ enabled: !!steamId },
	);

	if (isError) throw error;

	return { leaderData, isLoading, isFetched, isError };
};
