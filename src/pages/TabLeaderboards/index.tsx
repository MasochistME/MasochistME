import React, { Suspense } from 'react';
import styled from 'styled-components';
import { Tier } from '@masochistme/sdk/dist/v1/types';

import { useTiers } from 'sdk';
import { useActiveTab, useRankingList } from 'hooks';
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
	useActiveTab(TabDict.LEADERBOARDS);

	const { rankingList = [], isLoading, isFetched } = useRankingList();

	const lazyRankingList = rankingList.map(leader => (
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
	));

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
		<li key={`tier-${String(tier._id)}`}>
			<Icon icon={tier.icon as IconType} size={Size.MICRO} /> - worth{' '}
			{tier.score} pts - {tier?.description}
		</li>
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

const StyledTierTypes = styled.ul`
	margin: 0;
	li {
		text-align: left;
		i {
			width: 16px;
		}
	}
`;
