import React from 'react';
import styled from 'styled-components';
import { Member, Tier, Leaderboards } from '@masochistme/sdk/dist/v1/types';

import { useTiers, useCuratorMembers, useLeaderboards } from 'sdk';
import { useAppContext } from 'shared/store/context';
import { useActiveTab } from 'shared/hooks';
import { TabDict } from 'shared/config/tabs';
import { SearchBar } from 'containers';
import { Flex, Wrapper, Spinner } from 'components';

import { User } from './User';

export const TabLeaderboards = (): JSX.Element => {
	const { queryMember } = useAppContext();
	useActiveTab(TabDict.LEADERBOARDS);

	const { leaderboardsData, isLoading, isError } = useLeaderboards();
	const { tiersData } = useTiers();
	const { membersData } = useCuratorMembers();

	const createRankingList = () => {
		if (isError) return;
		return leaderboardsData?.map((leader: Leaderboards) => {
			const memberName =
				membersData.find((m: Member) => m.steamId === leader.memberId)?.name ??
				'UNKNOWN';
			const isUserSearch =
				memberName.toLowerCase().indexOf(queryMember.toLowerCase()) !== -1;
			return isUserSearch ? (
				<User
					steamId={leader.memberId}
					position={leader.position}
					key={`leaderboards-leader-${leader.memberId}`}
				/>
			) : null;
		});
	};

	return (
		<Flex column>
			<Wrapper type="description">
				<div className="page-description">
					<p>
						Ranking system utilizes the games&lsquo; score system. Depending on
						the game&lsquo;s individual difficulty level, it is given one of{' '}
						{tiersData?.length ?? 'X'} possible marks:
					</p>
					<ul>
						{tiersData.map((tier: Tier) => (
							<li key={`tier-${String(tier._id)}`}>
								<i className={tier.icon} /> - worth {tier.score} pts -{' '}
								{tier?.description}
							</li>
						))}
					</ul>
					<p>
						Completing a game might mean earning its most demanding achievement,
						or getting the in-game 100%; but for the sake of simplicity the
						ranking system present here assumes that completing a game means
						earning 100% of its Steam achievements. You are awarded points
						depending on the completed game&lsquo;s difficulty level, which are
						later summarized and used to determine your placement on the ranking
						ladder.
					</p>
				</div>
				<SearchBar />
			</Wrapper>
			<WrapperRanking>
				<RankingList>
					{isLoading ? <Spinner /> : createRankingList()}
				</RankingList>
			</WrapperRanking>
		</Flex>
	);
};

const WrapperRanking = styled.div`
	width: 100%;
`;

const RankingList = styled.ul`
	list-style-type: none;
	margin: 0;
	padding: 0;
	overflow: hidden;
	width: 100%;
`;
