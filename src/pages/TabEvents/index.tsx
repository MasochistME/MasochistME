import React from 'react';
import styled from 'styled-components';

import { useEvents } from 'sdk';
import { SubPage, Section, SectionProps } from 'containers';
import { Flex, Icon, Spinner } from 'components';
import { useActiveTab } from 'hooks';
import { TabDict, EventsDict } from 'configuration';

import { EventsList } from './EventsList';
import { EventsFilterBar } from './EventsFilterBar';

const TabEvents = (): JSX.Element => {
	useActiveTab(TabDict.EVENTS);

	const { isLoading, isFetched } = useEvents({
		sort: { date: 'desc' },
		limit: 50,
	});

	return (
		<SubPage>
			<StyledEventsList column>
				<TabEventsInfo isMobileOnly />
				<EventsFilterBar />
				{isLoading && <Spinner />}
				{isFetched && <EventsList />}
			</StyledEventsList>
			<TabEventsInfo isDesktopOnly width="100%" maxWidth="450px" />
		</SubPage>
	);
};

const TabEventsInfo = (props: Partial<SectionProps>): JSX.Element => {
	const { isLoading, isFetched } = useEvents({
		sort: { date: 'desc' },
		limit: 50,
	});

	const eventsDescriptions = EventsDict.map((event, index: number) => (
		<li key={`event-desc-${index}`}>
			<Icon icon={event.icon} /> - {event.description}
		</li>
	));

	return (
		<Section
			{...props}
			title="Community events"
			content={
				<Flex column gap={8}>
					<div>This is the list showcasing the last 100 events.</div>
					<div>There are {EventsDict.length} different types of events:</div>
					{isLoading && <Spinner />}
					{isFetched && (
						<StyledEventTypes>{eventsDescriptions}</StyledEventTypes>
					)}
					<div>
						In case of event relating to a no longer curated game or user no
						longer being part of the group, the
						<Icon icon="WarningTriangle" /> icon is used.
					</div>
				</Flex>
			}
		/>
	);
};

export default TabEvents;

const StyledEventsList = styled(Flex)`
	width: 100%;
`;

const StyledEventTypes = styled.ul`
	margin: 0;
	li {
		text-align: left;
		i {
			width: 16px;
		}
	}
`;
