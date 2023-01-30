import React, { Suspense } from 'react';
import styled from 'styled-components';
import { Tier } from '@masochistme/sdk/dist/v1/types';

import { useAppContext } from 'context';
import { useMembers, useLeaderboardsMembers, useTiers } from 'sdk';
import { useActiveTab } from 'hooks';
import { TabDict } from 'configuration/tabs';
import { SubPage, Section, SectionProps } from 'containers';
import { Flex, Icon, Skeleton, Spinner, IconType } from 'components';
import { Size } from 'components';

import { LeaderboardsFilterBar } from './LeaderboardsFilterBar';

const LeaderboardsMember = React.lazy(() =>
	import('./LeaderboardsMember').then(module => ({
		default: module.LeaderboardsMember,
	})),
);

const TabLeaderboards = (): JSX.Element => {
	const { queryMember } = useAppContext();
	useActiveTab(TabDict.LEADERBOARDS);

	const { leaderboardsData, isFetched, isLoading } = useLeaderboardsMembers();
	const { membersData = [] } = useMembers();

	const lazyRankingList = leaderboardsData.map(leader => {
		const memberName =
			membersData.find(member => member.steamId === leader.memberId)?.name ??
			'';
		const includesNameQuery = memberName
			.toLowerCase()
			.includes(queryMember.toLowerCase());
		if (queryMember && !includesNameQuery) return null;
		return (
			<Suspense
				key={`leaderboards-leader-${leader.memberId}`}
				fallback={
					<Skeleton width="100%" height="50px" style={{ margin: '2px 0' }} />
				}>
				<LeaderboardsMember
					steamId={leader.memberId}
					position={leader.position}
				/>
			</Suspense>
		);
	});

	return (
		<SubPage>
			<StyledLeaderboards>
				<TabLeaderboardsInfo isMobileOnly />
				<LeaderboardsFilterBar />
				{isLoading && <Spinner />}
				{isFetched && <Flex column>{lazyRankingList}</Flex>}
			</StyledLeaderboards>
			<TabLeaderboardsInfo isDesktopOnly minWidth="450px" maxWidth="450px" />
		</SubPage>
	);
};

const TabLeaderboardsInfo = (props: Partial<SectionProps>): JSX.Element => {
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
		<Section
			{...props}
			title="Game ranking system"
			content={
				<Flex column gap={8}>
					<div>
						Ranking system utilizes the games&lsquo; score system. Depending on
						the game&lsquo;s individual difficulty level, it is given one of{' '}
						{tiersData?.length ?? 'X'} possible marks:
					</div>
					{isTiersLoading && <Spinner />}
					{isTiersFetched && (
						<StyledTierTypes>{tiersDescriptions}</StyledTierTypes>
					)}
					<div>
						Completing a game might mean earning its most demanding achievement,
						or getting the in-game 100%; but for the sake of simplicity the
						ranking system present here assumes that completing a game means
						earning 100% of its Steam achievements.
					</div>
					<div>
						You are awarded points depending on the completed game&lsquo;s
						difficulty level, which are later summarized and used to determine
						your placement on the ranking ladder.
					</div>
				</Flex>
			}
		/>
	);
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
