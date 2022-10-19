import React from 'react';
import {
	Event,
	EventMemberJoin,
	EventType,
} from '@masochistme/sdk/dist/v1/types';

import { useCuratorMembers, useEvents } from 'sdk';
import { Flex } from 'components';
import { Section } from 'containers';
import { Avatar } from 'pages/TabLeaderboards/components';

export const SectionNewMembers = (): JSX.Element => {
	const { membersData } = useCuratorMembers();
	const { eventsData } = useEvents();

	const memberEvents = eventsData
		.filter(event => event.type === EventType.MEMBER_JOIN)
		.sort(
			(eventA: Event, eventB: Event) =>
				new Date(eventA.date).getTime() - new Date(eventB.date).getTime(),
		)
		.slice(0, 3) as unknown as EventMemberJoin[];

	const newestMembers = memberEvents.map(event => {
		const member = membersData.find(
			member => member.steamId === event.memberId,
		);
		if (member) return <Avatar src={member.avatar} alt="avatar" />;
	});

	return (
		<Section
			title="New members"
			content={
				<Flex justify gap="8px">
					{newestMembers}
				</Flex>
			}
		/>
	);
};
