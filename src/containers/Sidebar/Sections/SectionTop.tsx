import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { useLeaderboards, useCuratorMembers } from 'sdk';
import {
	SmallMember,
	EventLink,
	Section,
	SectionTitle,
} from 'containers/Sidebar/components';
import { Spinner } from 'components';

export const SectionTop = (): JSX.Element => {
	const history = useHistory();

	const { membersData } = useCuratorMembers();
	const { leaderboardsData, isFetched, isLoading } = useLeaderboards(10);

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
			<SmallMember key={`leaderboards-${leader.memberId}`}>
				<div>{leader.position}.</div>
				<EventLink onClick={onUserClick}>
					<span className="bold">{leader.name}</span>
				</EventLink>
				<div>{leader.sum} pts</div>
			</SmallMember>
		);
	};

	return (
		<Section>
			<SectionTitle>Top 10 users</SectionTitle>
			<FlexColumn>
				{isFetched && leaderboards?.map(leader => leaderboardRow(leader))}
				{isLoading && <Spinner />}
			</FlexColumn>
		</Section>
	);
};

const FlexColumn = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;
