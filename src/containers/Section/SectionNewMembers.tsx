import React from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { EventMemberJoin, EventType } from '@masochistme/sdk/dist/v1/types';

import { useCuratorMembers, useEvents } from 'sdk';
import { MemberAvatar, Section } from 'containers';
import { Flex } from 'components';
import { Size } from 'utils';

const NUMBER_OF_MEMBERS = 10;

export const SectionNewMembers = (): JSX.Element => {
	const history = useHistory();
	const { membersData } = useCuratorMembers();
	const { eventsData, isLoading, isFetched } = useEvents({
		limit: NUMBER_OF_MEMBERS,
		sort: { date: 'desc' },
		filter: { type: EventType.MEMBER_JOIN },
	});

	const onMemberClick = (memberId?: string) => {
		if (memberId) history.push(`/profile/${memberId}`);
	};

	const memberEvents = eventsData.filter(
		event => event.type === EventType.MEMBER_JOIN,
	) as unknown as EventMemberJoin[];

	const newestMembers = memberEvents.map(event => {
		const member = membersData.find(
			member => member.steamId === event.memberId,
		);
		if (member)
			return (
				<MemberAvatar
					key={`new-member-${member.steamId}`}
					member={member}
					size={Size.BIG}
					onClick={() => onMemberClick(member.steamId)}
					title={
						<Flex column>
							<span style={{ fontWeight: 'bold' }}>{member.name}</span>
							<span>Joined {dayjs(event.date).fromNow()}</span>
						</Flex>
					}
				/>
			);
	});

	const loadingMembers = new Array(NUMBER_OF_MEMBERS)
		.fill(null)
		.map((_, i: number) => (
			<MemberAvatar
				key={`new-member-${i}`}
				isLoading={isLoading}
				size={Size.BIG}
			/>
		));

	return (
		<Section
			minWidth="450px"
			title="New members"
			content={
				<StyledNewMembers>
					{isLoading && loadingMembers}
					{isFetched && newestMembers}
				</StyledNewMembers>
			}
		/>
	);
};

const StyledNewMembers = styled.div`
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	gap: 16px;
`;
