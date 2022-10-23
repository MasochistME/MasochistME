import React from 'react';
import styled from 'styled-components';
import { Member, Tier, Leaderboards } from '@masochistme/sdk/dist/v1/types';

import { useTiers, useCuratorMembers, useLeaderboards } from 'sdk';
import { useAppContext } from 'context';
import { media } from 'shared/theme';
import { useActiveTab } from 'shared/hooks';
import { TabDict } from 'shared/config/tabs';
import { SubPage, Section } from 'containers';
import { Flex, Spinner } from 'components';

import { LeaderboardsMember } from './LeaderboardsMember';
import { LeaderboardsFilterBar } from './LeaderboardsFilterBar';

const TabLeaderboards = (): JSX.Element => {
	useActiveTab(TabDict.LEADERBOARDS);

	const { queryMember } = useAppContext();
	const { leaderboardsData, isFetched, isLoading, isError } = useLeaderboards();
	const {
		tiersData,
		isLoading: isTiersLoading,
		isFetched: isTiersFetched,
	} = useTiers();
	const { membersData } = useCuratorMembers();

	const createRankingList = () => {
		if (isError) return;
		return leaderboardsData.map((leader: Leaderboards) => {
			const memberName =
				membersData.find((m: Member) => m.steamId === leader.memberId)?.name ??
				'UNKNOWN';
			const isUserSearch =
				memberName.toLowerCase().indexOf(queryMember.toLowerCase()) !== -1;
			return isUserSearch ? (
				<LeaderboardsMember
					steamId={leader.memberId}
					position={leader.position}
					key={`leaderboards-leader-${leader.memberId}`}
				/>
			) : null;
		});
	};

	const tiersDescriptions = tiersData.map((tier: Tier) => (
		<li key={`tier-${String(tier._id)}`}>
			<i className={tier.icon} /> - worth {tier.score} pts - {tier?.description}
		</li>
	));

	return (
		<SubPage>
			<StyledLeaderboards>
				<LeaderboardsFilterBar />
				{isLoading && <Spinner />}
				{isFetched && <Flex column>{createRankingList()}</Flex>}
			</StyledLeaderboards>
			<StyledSectionGameRanking
				title="Game ranking system"
				content={
					<Flex column gap={8}>
						<div>
							Ranking system utilizes the games&lsquo; score system. Depending
							on the game&lsquo;s individual difficulty level, it is given one
							of {tiersData?.length ?? 'X'} possible marks:
						</div>
						{isTiersLoading && <Spinner />}
						{isTiersFetched && (
							<StyledTierTypes>{tiersDescriptions}</StyledTierTypes>
						)}
						<div>
							Completing a game might mean earning its most demanding
							achievement, or getting the in-game 100%; but for the sake of
							simplicity the ranking system present here assumes that completing
							a game means earning 100% of its Steam achievements.
						</div>
						<div>
							You are awarded points depending on the completed game&lsquo;s
							difficulty level, which are later summarized and used to determine
							your placement on the ranking ladder.
						</div>
					</Flex>
				}
			/>
		</SubPage>
	);
};

export default TabLeaderboards;

const StyledLeaderboards = styled(Flex)`
	flex-direction: column;
	width: 1000px;
	max-width: 100%;
`;

const StyledSectionGameRanking = styled(Section)`
	min-width: 450px;
	max-width: 450px;
	@media (max-width: ${media.smallNetbooks}) {
		min-width: 0;
		width: 100%;
		max-width: 450px;
	}
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
