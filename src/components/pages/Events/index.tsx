import React from 'react';
import styled from 'styled-components';
import { Flex, Wrapper, Spinner } from 'shared/components';
import EventItem from './EventItem';
import { useEvents } from 'shared/hooks';
import { Event } from '@masochistme/sdk/dist/v1/types';

const EventTypes = styled.ul`
	li {
		i {
			width: 20px;
		}
	}
`;
const EventsList = styled.ul`
	margin: 0;
	padding: 0;
	width: 100%;
	list-style-type: none;
`;

const eventTypes = [
	{
		icon: 'fas fa-user-plus',
		description: 'new user joining the community',
	},
	{
		icon: 'fas fa-user-minus',
		description: 'user leaving the community',
	},
	{
		icon: 'fas fa-check-square',
		description: 'user of the community finishing 100% of the game',
	},
	{
		icon: 'fas fa-plus-square',
		description: 'new game being curated',
	},
	{
		icon: 'fas fa-minus-square',
		description: 'game being removed from curator',
	},
	{
		icon: 'fas fa-caret-square-up',
		description: 'game promoting a tier',
	},
	{
		icon: 'fas fa-caret-square-down',
		description: 'game demoting a tier',
	},
	{
		icon: 'fas fa-award',
		description: 'game getting a new badge',
	},
	{
		icon: 'fas fa-medal',
		description: 'user earning a new badge',
	},
	{
		icon: 'fas fa-tasks',
		description: 'game having achievements added or removed.',
	},
];

export default function PageEvents(): JSX.Element {
	const { data: events } = useEvents();
	const eventsDescriptions = eventTypes.map((event: any, index: number) => (
		<li key={`event-desc-${index}`}>
			<i className={event.icon}></i> - {event.description}
		</li>
	));

	return (
		<Flex column>
			<Wrapper type="description">
				<div className="page-description">
					<p>This is the list showcasing the last 100 events.</p>
					<p>There are {eventTypes.length} different types of events:</p>
					<EventTypes>{eventsDescriptions}</EventTypes>
					<p>
						In case of event relating to a no longer curated game or user no
						longer being part of the group, the{' '}
						<i className="fas fa-exclamation-triangle"></i> icon is used.
					</p>
				</div>
			</Wrapper>
			<Wrapper type="page">
				<EventsList>
					{events?.length ? (
						events.map((event: Event) => (
							<EventItem event={event} key={`event-${event._id}`} />
						))
					) : (
						<Spinner />
					)}
				</EventsList>
			</Wrapper>
		</Flex>
	);
}
