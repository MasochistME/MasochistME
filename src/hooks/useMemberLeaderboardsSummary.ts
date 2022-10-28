import { useMemo } from 'react';
import { PatronTier } from '@masochistme/sdk/dist/v1/types';

import { useCuratorMembers, useLeaderboardsMembers } from 'sdk';

export const useMemberLeaderboardsSummary = (memberId: string) => {
	const { leaderboardsData } = useLeaderboardsMembers();
	const { membersData } = useCuratorMembers();

	const leaderData = useMemo(() => {
		return leaderboardsData.find(l => l.memberId === memberId);
	}, []);
	const memberData = useMemo(() => {
		return membersData.find(m => m.steamId === memberId);
	}, []);

	const memberLeaderboardsSummary = useMemo(() => {
		return {
			...leaderData,
			name: memberData?.name ?? 'UNKNOWN',
			avatar: memberData?.avatar ?? 'UNKNOWN',
			isPrivate: memberData?.isPrivate ?? true,
			lastUpdated: memberData?.lastUpdated ?? 0,
			isDisabled: memberData?.isPrivate,
			isHighestPatronTier: leaderData?.patreonTier === PatronTier.TIER4,
		};
	}, []);

	return { memberLeaderboardsSummary, memberData, leaderData };
};
