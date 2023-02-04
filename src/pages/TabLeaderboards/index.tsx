import React from 'react';
import styled from 'styled-components';
import { Leaderboards, Tier } from '@masochistme/sdk/dist/v1/types';

import { useAppContext } from 'context';
import { useMembers, useLeaderboardsMembers, useTiers } from 'sdk';
import { useActiveTab } from 'hooks';
import { TabDict } from 'configuration/tabs';
import { SubPage, Section, SectionProps } from 'containers';
import {
	Flex,
	Icon,
	Spinner,
	IconType,
	QueryBoundary,
	Loader,
	Skeleton,
	ErrorFallback,
} from 'components';
import { Size } from 'components';

import { LeaderboardsFilterBar } from './LeaderboardsFilterBar';
import { LeaderboardsMember } from './LeaderboardsMember';

const TabLeaderboards = (): JSX.Element => {
	useActiveTab(TabDict.LEADERBOARDS);

	return (
		<SubPage>
			<StyledLeaderboards>
				<Info isMobileOnly />
				<LeaderboardsFilterBar />
				<QueryBoundary
					fallback={<LeaderboardsListSkeleton />}
					errorFallback={<ErrorFallback />}>
					<LeaderboardsList />
				</QueryBoundary>
			</StyledLeaderboards>
			<Info isDesktopOnly minWidth="450px" maxWidth="450px" />
		</SubPage>
	);
};

const LeaderboardsList = () => {
	const lazyRankingList = useLazyRankingList();
	return (
		<Flex column>
			{lazyRankingList.map(leader => (
				<LeaderboardsMember
					steamId={leader.memberId}
					position={leader.position}
					key={`leaderboards-leader-${leader.memberId}`}
				/>
			))}
		</Flex>
	);
};

const LeaderboardsListSkeleton = () => (
	<Flex column gap={2}>
		{new Array(10).fill(null).map(() => (
			<Skeleton width="100%" height="64px" />
		))}
	</Flex>
);

const Info = (props: Partial<SectionProps>) => (
	<Section
		title="Game ranking system"
		content={
			<QueryBoundary fallback={<Loader />} errorFallback={<ErrorFallback />}>
				<InfoContent />
			</QueryBoundary>
		}
		{...props}
	/>
);

const InfoContent = () => {
	const {
		tiersData,
		isLoading: isTiersLoading,
		isFetched: isTiersFetched,
	} = useTiers();

	const tiersDescriptions = tiersData.map((tier: Tier) => (
		<Flex key={`tier-${String(tier._id)}`} gap={4}>
			<Icon icon={tier.icon as IconType} size={Size.MICRO} /> - {tier.score} pts
			- {tier?.description}
		</Flex>
	));
	return (
		<Flex column gap={8}>
			<div>
				Ranking system utilizes the games&lsquo; score system. Depending on the
				game&lsquo;s individual difficulty level, it is given one of{' '}
				{tiersData?.length ?? 'X'} possible marks:
			</div>
			{isTiersLoading && <Spinner />}
			{isTiersFetched && <StyledTierTypes>{tiersDescriptions}</StyledTierTypes>}
			<div>
				Completing a game might mean earning its most demanding achievement, or
				getting the in-game 100%; but for the sake of simplicity the ranking
				system present here assumes that completing a game means earning 100% of
				its Steam achievements.
			</div>
			<div>
				You are awarded points depending on the completed game&lsquo;s
				difficulty level, which are later summarized and used to determine your
				placement on the ranking ladder.
			</div>
		</Flex>
	);
};

const useLazyRankingList = () => {
	const { queryMember } = useAppContext();
	const { leaderboardsData } = useLeaderboardsMembers();
	const { membersData = [] } = useMembers();

	return leaderboardsData
		.map(leader => {
			const memberName =
				membersData.find(member => member.steamId === leader.memberId)?.name ??
				'';
			const includesNameQuery = memberName
				.toLowerCase()
				.includes(queryMember.toLowerCase());
			if (queryMember && !includesNameQuery) return null;
			return leader;
		})
		.filter(Boolean) as Leaderboards[];
};

export default TabLeaderboards;

const StyledLeaderboards = styled(Flex)`
	flex-direction: column;
	width: 1000px;
	max-width: 100%;
`;

const StyledTierTypes = styled(Flex)`
	flex-direction: column;
	align-items: flex-start;
	gap: 8px;
	margin-left: 12px;
	line-height: 1.5em;
	text-align: left;
`;
