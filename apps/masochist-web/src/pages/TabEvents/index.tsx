import { Flex } from 'components';
import { TabDict } from 'configuration/tabs';
import { SubPage, Tab, TabPanel, Tabs } from 'containers';
import { useActiveTab, useContextualRouting } from 'hooks';
import { t } from 'i18n';
import React from 'react';
import styled from 'styled-components';
import { OtherEventsPage } from './OtherEvents';
import { RacesPage } from './Races';

enum EventTabs {
  RACES = 'races',
  OTHER = 'other',
}

export const TabEvents = (): JSX.Element => {
  useActiveTab(TabDict.EVENTS);
  const { navigateToRoute, route: event } = useContextualRouting<EventTabs>({
    key: 'event',
    value: EventTabs.RACES,
  });

  const handleChangeTab = (_e: React.SyntheticEvent, newTab: EventTabs) => {
    navigateToRoute({ event: newTab });
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
