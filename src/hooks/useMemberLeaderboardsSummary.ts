import { useMemo } from 'react';
import { PatronTier } from '@masochistme/sdk/dist/v1/types';

import { useCuratorMembers, useLeaderboardsMembers } from 'sdk';

export const useMemberLeaderboardsSummary = (memberId: string) => {
	const { leaderboardsData } = useLeaderboardsMembers();
	const { membersData } = useCuratorMembers();

	const leaderData = useMemo(() => {
		return leaderboardsData.find(l => l.memberId === memberId);
	}, [leaderboardsData, memberId]);

	const memberData = useMemo(() => {
		return membersData.find(m => m.steamId === memberId);
	}, [membersData, memberId]);

	const memberLeaderboardsSummary = useMemo(() => {
		return {
			...leaderData,
			name: memberData?.name ?? '—',
			avatar: memberData?.avatar ?? '—',
			isPrivate: memberData?.isPrivate ?? true,
			lastUpdated: memberData?.lastUpdated ?? 0,
			isDisabled: memberData?.isPrivate,
			isHighestPatronTier: leaderData?.patreonTier === PatronTier.TIER4,
		};
	}, [memberData, leaderData]);

	return { memberLeaderboardsSummary, memberData, leaderData };
};
