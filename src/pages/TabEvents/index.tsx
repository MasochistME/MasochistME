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

	const { eventsData, isLoading, isFetched } = useEvents(50);
	const eventsDescriptions = eventsDict.map((event, index: number) => (
		<li key={`event-desc-${index}`}>
			<i className={event.icon}></i> - {event.description}
		</li>
	));

	return (
		<SubPage>
			<StyledEventsList>
				{isLoading && <Spinner />}
				{isFetched &&
					eventsData.map((event: Event) => (
						<EventItem event={event} key={`event-${event._id}`} />
					))}
			</StyledEventsList>
			<Section
				minWidth="450px"
				maxWidth="450px"
				title="Community events"
				content={
					<Flex column gap={8}>
						<div>This is the list showcasing the last 100 events.</div>
						<div>There are {eventsDict.length} different types of events:</div>
						{isLoading && <Spinner />}
						{isFetched && (
							<StyledEventTypes>{eventsDescriptions}</StyledEventTypes>
						)}
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

const StyledEventTypes = styled.ul`
	margin: 0;
	li i {
		width: 20px;
	}
`;

const StyledEventsList = styled.ul`
	margin: 0;
	padding: 0;
	width: 100%;
	list-style-type: none;
`;
