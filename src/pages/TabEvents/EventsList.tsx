import React from 'react';
import styled from 'styled-components';
import {
	Event,
	EventAchievementNumberChange,
	EventBadgeCreate,
	EventBadgeGet,
	EventComplete,
	EventCustom,
	EventGameAdd,
	EventGameRemove,
	EventGameTierChange,
	EventMemberJoin,
	EventMemberLeave,
	EventType,
} from '@masochistme/sdk/dist/v1/types';

import { useAppContext } from 'context';
import { useEvents } from 'sdk';
import {
	DateBlock,
	Flex,
	QueryBoundary,
	ErrorFallback,
	Skeleton,
} from 'components';

import EventItem from './EventItems';
import { useTheme, ColorTokens } from 'styles';

const NUMBER_OF_EVENTS = 50;

export const EventsList = () => {
	return (
		<StyledEventList>
			<QueryBoundary
				fallback={<EventListSkeleton />}
				errorFallback={<ErrorFallback />}>
				<EventsListBoundary />
			</QueryBoundary>
		</StyledEventList>
	);
};

const EventsListBoundary = () => {
	const { visibleEvents } = useAppContext();
	const { colorTokens } = useTheme();
	const { eventsData } = useEvents({
		sort: { date: 'desc' },
		// @ts-ignore
		filter: { type: { $in: visibleEvents } },
		limit: NUMBER_OF_EVENTS,
	});

	const identifyEvent = (event: Event): JSX.Element | null => {
		const type: EventType = event.type;

		switch (type) {
			case EventType.GAME_ADD:
				return <EventItem.GameAddEvent event={event as EventGameAdd} />;
			case EventType.GAME_REMOVE:
				return <EventItem.GameRemoveEvent event={event as EventGameRemove} />;
			case EventType.MEMBER_JOIN:
				return <EventItem.MemberJoinEvent event={event as EventMemberJoin} />;
			case EventType.MEMBER_LEAVE:
				return <EventItem.MemberLeaveEvent event={event as EventMemberLeave} />;
			case EventType.COMPLETE:
				return <EventItem.GameCompleteEvent event={event as EventComplete} />;
			case EventType.GAME_TIER_CHANGE:
				return (
					<EventItem.TierChangeEvent event={event as EventGameTierChange} />
				);
			case EventType.BADGE_CREATE:
				return <EventItem.BadgeCreateEvent event={event as EventBadgeCreate} />;
			case EventType.BADGE_GET:
				return <EventItem.BadgeGrantEvent event={event as EventBadgeGet} />;
			case EventType.ACHIEVEMENTS_CHANGE:
				return (
					<EventItem.AchievementNumberChangeEvent
						event={event as EventAchievementNumberChange}
					/>
				);
			case EventType.CUSTOM:
				return <EventItem.CustomEvent event={event as EventCustom} />;
			default:
				return null;
		}
	};

	return (
		<>
			{eventsData.map((event: Event) => (
				<StyledEventItem
					align
					colorTokens={colorTokens}
					key={`event-${String(event._id)}`}>
					<DateBlock date={event.date} />
					{identifyEvent(event)}
				</StyledEventItem>
			))}
		</>
	);
};

const EventListSkeleton = () => (
	<>
		{new Array(NUMBER_OF_EVENTS).fill(null).map((_, i: number) => (
			<Skeleton
				key={`event-new-${i}`}
				height={42}
				width="100%"
				style={{ marginBottom: '2px' }}
			/>
		))}
	</>
);

const StyledEventList = styled(Flex)`
	flex-direction: column;
	max-width: 1000px;
	width: 100%;
`;

const StyledEventItem = styled(Flex)<{ colorTokens: ColorTokens }>`
	justify-content: space-between;
	width: 100%;
	padding: 4px;
	border-bottom: 1px solid
		${({ colorTokens }) => colorTokens['core-primary-bg']};
	border-top: 1px solid
		${({ colorTokens }) => colorTokens['semantic-color--disabled']}66;
	&:first-child {
		border-top: none;
	}
	&:last-child {
		border-bottom: none;
	}
`;
