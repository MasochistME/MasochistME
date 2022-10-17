import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { useMembers } from 'shared/hooks';
import {
	SmallMember,
	EventLink,
	Section,
	SectionTitle,
} from 'containers/Sidebar/components';
import { Spinner } from 'components';
import { Member } from '@masochistme/sdk/dist/v1/types';

export const SectionTop = (): JSX.Element => {
	const history = useHistory();

	const { membersData } = useMembers();

	const members = useSelector((state: any) => {
		const membersRating = state.ranking.slice(0, 10);
		const membersFull = membersRating.map((user: any) => ({
			...user,
			name: membersData.find((m: Member) => m.steamId === user.id)?.name,
		}));
		return membersFull;
	});

	const userRow = (user: any, index: number) => {
		const onUserClick = () => history.push(`/profile/${user.id}`);
		return (
			<SmallMember key={`sidebar-user-${index}`}>
				<div>{index + 1}.</div>
				<EventLink onClick={onUserClick}>
					<span className="bold">{user.name}</span>
				</EventLink>
				<div>{user.points.sum} pts</div>
			</SmallMember>
		);
	};

	return (
		<Section>
			<SectionTitle>Top 10 users</SectionTitle>
			<FlexColumn>
				{members.length ? (
					members.map((user: any, userIndex: number) =>
						userRow(user, userIndex),
					)
				) : (
					<Spinner />
				)}
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
