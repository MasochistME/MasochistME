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

import { colors, fonts } from 'shared/theme';
import {
	AchievementNumberChangeEvent,
	CompleteEvent,
	CustomEvent,
	GameEvent,
	MemberEvent,
	TierChangeEvent,
	BadgeEvent,
} from './EventTypes';

type Props = {
	event: Event;
};

export default function EventItem(props: Props): JSX.Element | null {
	const { event } = props;

	const identifyEvent = (event: Event): JSX.Element | null => {
		const type: EventType = event.type;

		switch (type) {
			case 'newGame':
				return <GameEvent event={event as EventGameAdd} action="added" />;
			case 'gameRemoved':
				return <GameEvent event={event as EventGameRemove} action="removed" />;
			case 'memberJoined':
				return <MemberEvent event={event as EventMemberJoin} action="join" />;
			case 'memberLeft':
				return <MemberEvent event={event as EventMemberLeave} action="leave" />;
			case 'complete':
				return <CompleteEvent event={event as EventComplete} />;
			case 'tierChange':
				return <TierChangeEvent event={event as EventGameTierChange} />;
			case 'badgeAdded':
				return <BadgeEvent event={event as EventBadgeCreate} action="added" />;
			case 'badgeGiven':
				return <BadgeEvent event={event as EventBadgeGet} action="given" />;
			case 'achievementNumberChange':
				return (
					<AchievementNumberChangeEvent
						event={event as EventAchievementNumberChange}
					/>
				);
			case 'custom':
				return <CustomEvent event={event as EventCustom} />;
			default:
				return null;
		}
	};

	const relevantEvent = identifyEvent(event);

	return relevantEvent ? (
		<StyledEvent key={`event-${Date.now()}`}>
			<EventDate> {new Date(event.date).toLocaleString()} </EventDate>
			{relevantEvent}
		</StyledEvent>
	) : null;
}

const StyledEvent = styled.li`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-content: center;
	width: 100%;
	height: 35px;
	border-bottom: 1px solid ${colors.newDark};
	border-top: 1px solid ${colors.newMediumGrey};
	&:first-child {
		border-top: none;
	}
	&:last-child {
		border-bottom: none;
	}
`;
const EventDate = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100px;
	max-width: 100px;
	font-size: 0.7em;
	font-family: ${fonts.Verdana};
	text-align: center;
`;
