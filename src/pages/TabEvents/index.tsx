import React from 'react';
import styled from 'styled-components';
import { Event } from '@masochistme/sdk/dist/v1/types';

import { useEvents } from 'sdk';
import { SubPage, Section } from 'containers';
import { Flex, Spinner } from 'components';
import { useActiveTab } from 'shared/hooks';
import { TabDict } from 'shared/config/tabs';

import { eventsDict } from './eventsDict';
import EventItem from './EventItem';

export const TabEvents = (): JSX.Element => {
	useActiveTab(TabDict.EVENTS);

	const { eventsData, isLoading, isFetched } = useEvents();
	const eventsDescriptions = eventsDict.map((event: any, index: number) => (
		<li key={`event-desc-${index}`}>
			<i className={event.icon}></i> - {event.description}
		</li>
	));

	return (
		<SubPage>
			<EventsList>
				{isLoading && <Spinner />}
				{isFetched &&
					eventsData.map((event: Event) => (
						<EventItem event={event} key={`event-${event._id}`} />
					))}
			</EventsList>
			<Section
				maxWidth="300px"
				title="Community events"
				content={
					<Flex column gap={4}>
						<div>This is the list showcasing the last 100 events.</div>
						<div>There are {eventsDict.length} different types of events:</div>
						<EventTypes>{eventsDescriptions}</EventTypes>
						<div>
							In case of event relating to a no longer curated game or user no
							longer being part of the group, the{' '}
							<i className="fas fa-exclamation-triangle"></i> icon is used.
						</div>
					</Flex>
				}
			/>
		</SubPage>
	);
};

const EventTypes = styled.ul`
	margin: 0;
	li i {
		width: 20px;
	}
`;
const EventsList = styled.ul`
	margin: 0;
	padding: 0;
	width: 100%;
	list-style-type: none;
`;
