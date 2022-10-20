import React from 'react';
import styled from 'styled-components';
import { EventBadgeCreate, EventType } from '@masochistme/sdk/dist/v1/types';

import { useBadges, useEvents } from 'sdk';
import { BadgeThumbnail, Section } from 'containers';
import { Size } from 'utils';

export const SectionFeatured = (): JSX.Element => {
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
			title="Featured"
			fullWidth
			content={
				<div className="video-responsive">
					<iframe
						width="853"
						height="440"
						src={`https://www.youtube.com/embed/9Lz7VeVDmV4`}
						frameBorder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowFullScreen
						title="Embedded youtube"
					/>
				</div>
			}
		/>
	);
};

const StyledNewMembers = styled.div`
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	gap: 4px;
`;
