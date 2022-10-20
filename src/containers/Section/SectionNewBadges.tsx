import React from 'react';
import styled from 'styled-components';
import { EventBadgeCreate, EventType } from '@masochistme/sdk/dist/v1/types';

import { useBadges, useEvents } from 'sdk';
import { BadgeThumbnail, Section } from 'containers';
import { Size } from 'utils';

export const SectionNewBadges = (): JSX.Element => {
	const { badgesData } = useBadges();
	const { eventsData } = useEvents({
		filter: { type: EventType.BADGE_CREATE },
		sort: { date: 'desc' },
		limit: 6,
	});

	const badgeEvents = eventsData.filter(
		event => event.type === EventType.BADGE_CREATE,
	) as unknown as EventBadgeCreate[];

	const newestBadges = badgeEvents.map(event => {
		const badge = badgesData.find(badge => String(badge._id) === event.badgeId);
		if (badge) return <BadgeThumbnail badge={badge} size={Size.BIG} />;
	});

	return (
		<Section
			title="New badges"
			content={<StyledNewMembers>{newestBadges}</StyledNewMembers>}
		/>
	);
};

const StyledNewMembers = styled.div`
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	gap: 4px;
`;
