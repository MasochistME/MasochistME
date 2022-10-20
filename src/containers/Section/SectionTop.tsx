import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { useLeaderboards, useCuratorMembers } from 'sdk';
import { EventLink, Section } from 'containers';
import { Flex, Spinner } from 'components';

export const SectionTop = (): JSX.Element => {
	const history = useHistory();

	const { membersData } = useCuratorMembers();
	const { leaderboardsData, isFetched, isLoading } = useLeaderboards(11);

	const leaderboards = leaderboardsData.map(leader => ({
		position: leader.position,
		memberId: leader.memberId,
		sum: leader.sum,
		name:
			membersData.find(member => member.steamId === leader.memberId)?.name ??
			'UNKNOWN',
	}));

	const leaderboardRow = (leader: {
		sum: number;
		name: string;
		memberId: string;
		position: number;
	}) => {
		const onUserClick = () => history.push(`/profile/${leader.memberId}`);
		return (
			<StyledSectionTopMember row align key={`leaderboards-${leader.memberId}`}>
				<div>{leader.position}.</div>
				<EventLink
					onClick={onUserClick}
					style={{
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						whiteSpace: 'nowrap',
					}}>
					<span className="bold">{leader.name}</span>
				</EventLink>
				<div style={{ whiteSpace: 'nowrap' }}>{leader.sum} pts</div>
			</StyledSectionTopMember>
		);
	};

	return (
		<Section
			title="Top 10 users"
			minWidth="400px"
			maxWidth="450px"
			content={
				<Flex column align justify gap={5}>
					{isFetched && leaderboards?.map(leader => leaderboardRow(leader))}
					{isLoading && <Spinner />}
				</Flex>
			}
		/>
	);
};

export const StyledSectionTopMember = styled(Flex)`
	width: 100%;
	justify-content: space-between;
	padding: 0 16px;
	margin-bottom: 1px;
`;
