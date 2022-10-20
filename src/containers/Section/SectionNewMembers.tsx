import React from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { EventMemberJoin, EventType } from '@masochistme/sdk/dist/v1/types';

import { useCuratorMembers, useEvents } from 'sdk';
import { MemberAvatar, Section } from 'containers';
import { Flex } from 'components';
import { Size } from 'utils';

export const SectionNewMembers = (): JSX.Element => {
	const { membersData } = useCuratorMembers();
	const { eventsData } = useEvents({
		limit: 10,
		sort: { date: 'desc' },
		filter: { type: EventType.MEMBER_JOIN },
	});

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
					member={member}
					size={Size.BIG}
					title={
						<Flex column>
							<span style={{ fontWeight: 'bold' }}>{member.name}</span>
							<span>Joined {dayjs(event.date).fromNow()}</span>
						</Flex>
					}
				/>
			);
	});

	return (
		<Section
			title="New members"
			content={<StyledNewMembers>{newestMembers}</StyledNewMembers>}
		/>
	);
};

const StyledNewMembers = styled.div`
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	gap: 4px;
`;
