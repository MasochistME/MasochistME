import React, { useState } from 'react';
import styled from 'styled-components';

import { useActiveTab } from 'hooks';
import { TabDict } from 'configuration/tabs';
import { Flex } from 'components';
import { SubPage, Tabs, Tab, TabPanel } from 'containers';

import { RacesPage } from './RacesPage';
import { OtherEventsPage } from './OtherEventsPage';

enum EventTabs {
	RACES = 'races',
	OTHER = 'other',
}

export const TabEvents = (): JSX.Element => {
	useActiveTab(TabDict.EVENTS);

	const [activeTab, setActiveTab] = useState<EventTabs>(EventTabs.RACES);

	const handleChangeTab = (_e: React.SyntheticEvent, newTab: EventTabs) => {
		setActiveTab(newTab);
	};

	return (
		<SubPage>
			<StyledEvents>
				<Tabs value={activeTab} onChange={handleChangeTab}>
					<Tab label="Races" value={EventTabs.RACES} />
					<Tab label="Other events" value={EventTabs.OTHER} />
				</Tabs>
				<TabPanel activeTab={activeTab} tabId={EventTabs.RACES}>
					<RacesPage />
				</TabPanel>
				<TabPanel activeTab={activeTab} tabId={EventTabs.OTHER}>
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
