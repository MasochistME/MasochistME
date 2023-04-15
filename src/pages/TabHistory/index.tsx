import React from 'react';
import styled from 'styled-components';

import { SubPage, Section, SectionProps } from 'containers';
import { Flex, Icon, Loader, QueryBoundary, ErrorFallback } from 'components';
import { useActiveTab } from 'hooks';
import { TabDict, LogDictionary } from 'configuration';

import { LogsList } from './LogsList';
import { LogsFilterBar } from './LogsFilterBar';

export const TabHistory = (): JSX.Element => {
	useActiveTab(TabDict.HISTORY);

	return (
		<SubPage>
			<StyledLogsList column>
				<Info isMobileOnly />
				<QueryBoundary fallback={<Loader />} errorFallback={<ErrorFallback />}>
					<LogsFilterBar />
				</QueryBoundary>
				<QueryBoundary fallback={<Loader />} errorFallback={<ErrorFallback />}>
					<LogsList />
				</QueryBoundary>
			</StyledLogsList>
			<Info isDesktopOnly width="100%" maxWidth="45rem" />
		</SubPage>
	);
};

const Info = (props: Partial<SectionProps>): JSX.Element => (
	<Section
		{...props}
		title="Community's history"
		content={
			<QueryBoundary fallback={<Loader />} errorFallback={<ErrorFallback />}>
				<InfoBoundary />
			</QueryBoundary>
		}
	/>
);

const InfoBoundary = () => {
	const logDescriptions = LogDictionary.map((log, index: number) => (
		<Flex key={`log-desc-${index}`} gap={4}>
			<Icon icon={log.icon} /> - {log.description},
		</Flex>
	));
	return (
		<Flex column gap={8}>
			<div>This is the list showcasing the last 100 logs.</div>
			<div>
				There are {LogDictionary.length} different types of items that can be
				logged here:
			</div>
			<StyledLogTypes>{logDescriptions}</StyledLogTypes>
		</Flex>
	);
};

const StyledLogsList = styled(Flex)`
	width: 100%;
`;

const StyledLogTypes = styled(Flex)`
	flex-direction: column;
	align-items: flex-start;
	gap: var(--size-8);
	margin-left: var(--size-12);
	line-height: var(--size-15);
	text-align: left;
`;
