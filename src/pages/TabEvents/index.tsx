import React from 'react';
import styled from 'styled-components';
import { Event } from '@masochistme/sdk/dist/v1/types';

import { Flex, Wrapper, Spinner } from 'components';
import { useEvents } from 'shared/hooks';
import EventItem from './EventItem';
import { eventsDict } from './eventsDict';

export const TabEvents = (): JSX.Element => {
	const { data: events } = useEvents();
	const eventsDescriptions = eventsDict.map((event: any, index: number) => (
		<li key={`event-desc-${index}`}>
			<i className={event.icon}></i> - {event.description}
		</li>
	));

	return (
		<Flex column>
			<Wrapper type="description">
				<div className="page-description">
					<p>This is the list showcasing the last 100 events.</p>
					<p>There are {eventsDict.length} different types of events:</p>
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
};

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
