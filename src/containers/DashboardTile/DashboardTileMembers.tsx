import React from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { EventMemberJoin, EventType } from '@masochistme/sdk/dist/v1/types';

import { media } from 'styles';
import { useCuratorMembers, useEvents } from 'sdk';
import { MemberAvatar, Section, SectionProps } from 'containers';
import { Flex } from 'components';
import { Size } from 'components';

const NUMBER_OF_MEMBERS = 10;

export const DashboardTileMembers = (
	props: Omit<SectionProps, 'content' | 'title'>,
): JSX.Element => {
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
			width="100%"
			maxWidth="450px"
			title="New members"
			content={
				<StyledNewMembers>
					{isLoading && loadingMembers}
					{isFetched && newestMembers}
				</StyledNewMembers>
			}
			{...props}
		/>
	);
};

const StyledNewMembers = styled(Flex)`
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	justify-content: center;
	gap: 16px;
	flex-wrap: wrap;
	@media (max-width: ${media.smallNetbooks}) {
		gap: 4px;
	}
	@media (max-width: ${media.bigPhones}) {
		display: flex;
	}
`;
