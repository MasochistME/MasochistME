import React from 'react';
import styled from 'styled-components';
import { colors, fonts } from 'shared/theme';
import { TEventTypes } from 'shared/types/events';
import {
	AchievementNumberChangeEvent,
	CompleteEvent,
	CustomEvent,
	GameEvent,
	MemberEvent,
	TierChangeEvent,
	BadgeEvent,
} from './EventTypes';

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

type Props = {
	event: any;
};

export default function Event(props: Props): JSX.Element | null {
	const { event } = props;

	const identifyEvent = (event: any): JSX.Element | null => {
		const type: TEventTypes = event.type;

		switch (type) {
			case 'newGame':
				return <GameEvent event={event} action="added" />;
			case 'gameRemoved':
				return <GameEvent event={event} action="removed" />;
			case 'memberJoined':
				return <MemberEvent event={event} action="join" />;
			case 'memberLeft':
				return <MemberEvent event={event} action="leave" />;
			case 'complete':
				return <CompleteEvent event={event} />;
			case 'tierChange':
				return <TierChangeEvent event={event} />;
			case 'badgeAdded':
				return <BadgeEvent event={event} action="added" />;
			case 'badgeGiven':
				return <BadgeEvent event={event} action="given" />;
			case 'achievementNumberChange':
				return <AchievementNumberChangeEvent event={event} />;
			case 'custom':
				return <CustomEvent event={event} />;
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
