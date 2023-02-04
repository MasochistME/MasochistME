import React from 'react';
import styled from 'styled-components';

import { SubPage, Section, SectionProps } from 'containers';
import { Flex, Icon, Loader, QueryBoundary, ErrorFallback } from 'components';
import { useActiveTab } from 'hooks';
import { TabDict, EventsDict } from 'configuration';

import { EventsList } from './EventsList';
import { EventsFilterBar } from './EventsFilterBar';

const TabEvents = (): JSX.Element => {
	useActiveTab(TabDict.EVENTS);

	return (
		<SubPage>
			<StyledEventsList column>
				<Info isMobileOnly />
				<QueryBoundary fallback={<Loader />} errorFallback={<ErrorFallback />}>
					<EventsFilterBar />
				</QueryBoundary>
				<QueryBoundary fallback={<Loader />} errorFallback={<ErrorFallback />}>
					<EventsList />
				</QueryBoundary>
			</StyledEventsList>
			<Info isDesktopOnly width="100%" maxWidth="450px" />
		</SubPage>
	);
};

const Info = (props: Partial<SectionProps>): JSX.Element => (
	<Section
		{...props}
		title="Community events"
		content={
			<QueryBoundary fallback={<Loader />} errorFallback={<ErrorFallback />}>
				<InfoBoundary />
			</QueryBoundary>
		}
	/>
);

const InfoBoundary = () => {
	const eventsDescriptions = EventsDict.map((event, index: number) => (
		<Flex key={`event-desc-${index}`} gap={4}>
			<Icon icon={event.icon} /> - {event.description},
		</Flex>
	));
	return (
		<Flex column gap={8}>
			<div>This is the list showcasing the last 100 events.</div>
			<div>There are {EventsDict.length} different types of events:</div>
			<StyledEventTypes>{eventsDescriptions}</StyledEventTypes>
		</Flex>
	);
};

export default TabEvents;

const StyledEventsList = styled(Flex)`
	width: 100%;
`;

const StyledEventTypes = styled(Flex)`
	flex-direction: column;
	align-items: flex-start;
	gap: 8px;
	margin-left: 12px;
	line-height: 1.5em;
	text-align: left;
`;
