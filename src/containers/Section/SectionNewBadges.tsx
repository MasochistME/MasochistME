import React from 'react';
import styled from 'styled-components';
import { EventBadgeCreate, EventType } from '@masochistme/sdk/dist/v1/types';

import { useBadges, useEvents } from 'sdk';
import { BadgeThumbnail, Section } from 'containers';
import { Size } from 'utils';

const NUMBER_OF_BADGES = 5;

export const SectionNewBadges = (): JSX.Element => {
	const {
		badgesData,
		isLoading: isBadgesLoading,
		isFetched: isBadgesFetched,
	} = useBadges();
	const {
		eventsData,
		isLoading: isEventsLoading,
		isFetched: isEventsFetched,
	} = useEvents({
		filter: { type: EventType.BADGE_CREATE },
		sort: { date: 'desc' },
		limit: NUMBER_OF_BADGES,
	});

	const isLoading = isBadgesLoading && isEventsLoading;
	const isFetched = isBadgesFetched && isEventsFetched;

	const badgeEvents = eventsData.filter(
		event => event.type === EventType.BADGE_CREATE,
	) as unknown as EventBadgeCreate[];

	const newestBadges = badgeEvents.map(event => {
		const badge = badgesData.find(badge => String(badge._id) === event.badgeId);
		if (badge)
			return (
				<BadgeThumbnail
					key={`badge-new-${badge._id}`}
					badge={badge}
					size={Size.BIG}
				/>
			);
	});

	const loadingBadges = new Array(NUMBER_OF_BADGES)
		.fill(null)
		.map((_, i: number) => (
			<BadgeThumbnail
				key={`badge-new-${i}`}
				isLoading={isLoading}
				size={Size.BIG}
			/>
		));

	return (
		<Section
			title="New badges"
			content={
				<StyledNewMembers>
					{isLoading && loadingBadges}
					{isFetched && newestBadges}
				</StyledNewMembers>
			}
		/>
	);
};

const StyledNewMembers = styled.div`
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	gap: 4px;
`;
