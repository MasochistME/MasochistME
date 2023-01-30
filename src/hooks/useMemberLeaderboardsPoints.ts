import { useMemo } from 'react';
import { Tier } from '@masochistme/sdk/dist/v1/types';

import { useTiers, useLeaderboardsMembers } from 'sdk';

export const useMemberLeaderboardsPoints = (memberId: string) => {
	const {
		tiersData,
		isLoading: isTiersLoading,
		isFetched: isTiersFetched,
	} = useTiers();
	const {
		leaderboardsData,
		isLoading: isLeaderboardsLoading,
		isFetched: isLeaderboardsFetched,
	} = useLeaderboardsMembers();

	const member = useMemo(() => {
		return leaderboardsData.find(l => l.memberId === memberId);
	}, [leaderboardsData]);

	const isLoading = isLeaderboardsLoading && isTiersLoading;
	const isFetched = isLeaderboardsFetched && isTiersFetched;

	/**
	 * All of the member's points, grouped by game tier.
	 */
	const tierPoints = useMemo(() => {
		return tiersData.map((tier: Tier) => {
			const gameTier = member?.games?.find(game => game.tier === tier.id);
			return {
				...tier,
				...gameTier,
			};
		});
	}, [tiersData, leaderboardsData]);

	return { tierPoints, member, isLoading, isFetched };
};
