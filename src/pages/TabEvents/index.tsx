import React from 'react';
import styled from 'styled-components';

import { useActiveTab, useContextualRouting, useMixpanel } from 'hooks';
import { TabDict } from 'configuration/tabs';
import { Flex } from 'components';
import { SubPage, Tabs, Tab, TabPanel } from 'containers';

import { RacesPage } from './Races';
import { OtherEventsPage } from './OtherEvents';
import { t } from 'i18n';

enum EventTabs {
	RACES = 'races',
	OTHER = 'other',
}

export const TabEvents = (): JSX.Element => {
	useActiveTab(TabDict.EVENTS);
	const { track } = useMixpanel();
	const { navigateToRoute, route: event } = useContextualRouting<EventTabs>({
		key: 'event',
		value: EventTabs.RACES,
	});

	const handleChangeTab = (_e: React.SyntheticEvent, newTab: EventTabs) => {
		navigateToRoute({ event: newTab });
		track('events.tab.change', { tab: newTab });
	};

	return (
		<SubPage>
			<StyledEvents>
				<Tabs value={event} onChange={handleChangeTab}>
					<Tab label={t('events.tab.races')} value={EventTabs.RACES} />
					<Tab label={t('events.tab.other_events')} value={EventTabs.OTHER} />
				</Tabs>
				<TabPanel activeTab={event} tabId={EventTabs.RACES}>
					<RacesPage />
				</TabPanel>
				<TabPanel activeTab={event} tabId={EventTabs.OTHER}>
					<OtherEventsPage />
				</TabPanel>
			</StyledEvents>
		</SubPage>
	);
};

const StyledEvents = styled(Flex)`
	flex-direction: column;
	flex: 1 1 100%;
	width: 100%;
`;
