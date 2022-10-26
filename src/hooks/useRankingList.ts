import { useMemo } from 'react';
import { Member, Leaderboards } from '@masochistme/sdk/dist/v1/types';

import { useCuratorMembers, useLeaderboardsMembers } from 'sdk';
import { useAppContext } from 'context';

export const useRankingList = () => {
	const { queryMember } = useAppContext();
	const { membersData } = useCuratorMembers();
	const { leaderboardsData, isFetched, isLoading, isError } =
		useLeaderboardsMembers();

	const rankingList = useMemo(() => {
		if (isError) return;
		return leaderboardsData.filter((leader: Leaderboards) => {
			console.count('dupa');
			const memberName =
				membersData.find((m: Member) => m.steamId === leader.memberId)?.name ??
				'UNKNOWN';
			const isUserSearch =
				memberName.toLowerCase().indexOf(queryMember.toLowerCase()) !== -1;
			return isUserSearch;
		});
	}, [leaderboardsData, membersData]);

	return { rankingList, isFetched, isLoading, isError };
};
