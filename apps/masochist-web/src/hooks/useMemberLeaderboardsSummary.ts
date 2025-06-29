import { PatronTier } from '@masochistme/sdk/dist/v1/types';
import { useMemo } from 'react';
import { useCuratorMembers, useLeaderboardsMembers } from 'sdk';
import { TimePeriod } from 'utils/getTimePeriod';

export const useMemberLeaderboardsSummary = (
  memberId: string,
  timePeriod: TimePeriod,
) => {
  const { leaderboardsData } = useLeaderboardsMembers({ from: timePeriod });
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
