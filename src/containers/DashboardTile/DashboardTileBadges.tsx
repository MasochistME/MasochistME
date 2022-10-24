import React from 'react';
import styled from 'styled-components';
import { EventBadgeCreate, EventType } from '@masochistme/sdk/dist/v1/types';

import { media } from 'shared/theme';
import { useBadges, useEvents } from 'sdk';
import { BadgeThumbnail, Section, SectionProps } from 'containers';
import { Flex } from 'components';
import { Size } from 'utils';

const NUMBER_OF_BADGES = 5;

export const DashboardTileBadges = (
	props: Omit<SectionProps, 'content' | 'title'>,
): JSX.Element => {
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
			width="100%"
			maxWidth="450px"
			title="New badges"
			content={
				<StyledNewBadges>
					{isLoading && loadingBadges}
					{isFetched && newestBadges}
				</StyledNewBadges>
			}
			{...props}
		/>
	);
};

const StyledNewBadges = styled(Flex)`
	justify-content: center;
	gap: 16px;
	@media (max-width: ${media.smallNetbooks}) {
		gap: 4px;
		flex-wrap: wrap;
	}
`;
