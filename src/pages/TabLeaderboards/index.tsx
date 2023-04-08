import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Leaderboards } from '@masochistme/sdk/dist/v1/types';

import { useAppContext } from 'context';
import { useMembers, useLeaderboardsMembers } from 'sdk';
import { useActiveTab } from 'hooks';
import { TabDict } from 'configuration/tabs';
import { SubPage, Section, SectionProps } from 'containers';
import {
	Flex,
	QueryBoundary,
	Loader,
	Skeleton,
	ErrorFallback,
} from 'components';

import { LeaderboardsFilterBar } from './LeaderboardsFilterBar';
import { LeaderboardsMember } from './LeaderboardsMember';
import { curatorURL } from 'utils';

export const TabLeaderboards = (): JSX.Element => {
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
			<Info isDesktopOnly minWidth="45rem" maxWidth="45rem" />
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
			<Skeleton width="100%" height="var(--size-64)" />
		))}
	</Flex>
);

const Info = (props: Partial<SectionProps>) => (
	<Section
		title="Game ranking system"
		content={
			<QueryBoundary fallback={<Loader />} errorFallback={<ErrorFallback />}>
				<InfoBoundary />
			</QueryBoundary>
		}
		{...props}
	/>
);

const InfoBoundary = () => {
	return (
		<Flex column gap={8}>
			<div>
				Ranking system utilizes the games&lsquo; score system. Every completed
				game grants you amount of points based on the game's tier. For the sake
				of simplicity, "completing a game" means earning 100% of its Steam
				achievements. You can also earn additional points by getting{' '}
				<Link to={`/badges`}>badges</Link>.
			</div>
			<div>
				You are placed on leaderboards with other community members based on the
				sum of points you earned. To appear in the leaderboards, you have to
				join{' '}
				<a href={curatorURL} target="_blank">
					our Steam curator
				</a>
				.
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

const StyledLeaderboards = styled(Flex)`
	flex-direction: column;
	width: 100rem;
	max-width: 100%;
`;
