import { Tab, TabPanel, Tabs } from 'containers';
import { useContextualRouting } from 'hooks';
import { SyntheticEvent } from 'react';
import styled from 'styled-components';
import { GameProfileFeatured } from './GameProfileFeatured';
import { GameProfileLeaderboards } from './GameProfileLeaderboards';
// import { GameProfileGraphs } from './Graphs';

enum TabRoutes {
  LEADERBOARDS = 'leaderboards',
  FEATURED = 'featured',
  GRAPHS = 'graphs',
  BADGES = 'badges',
}

export const TabGameTabsBoundary = ({ gameId }: { gameId: number }) => {
  const { navigateToRoute, route: tab } = useContextualRouting<TabRoutes>({
    key: 'tab',
    value: TabRoutes.LEADERBOARDS,
  });

  const handleChangeTab = (_e: SyntheticEvent, newTab: TabRoutes) => {
    navigateToRoute({ tab: newTab });
  };

  return (
    <StyledGameTabs>
      <Tabs value={tab} onChange={handleChangeTab}>
        <Tab label="Leaderboards" value={TabRoutes.LEADERBOARDS} />
        <Tab label="Featured content" value={TabRoutes.FEATURED} />
        {/* <Tab label="Graphs" value={TabRoutes.GRAPHS} /> */}
      </Tabs>
      <TabPanel activeTab={tab} tabId={TabRoutes.LEADERBOARDS}>
        <GameProfileLeaderboards gameId={gameId} />
      </TabPanel>
      <TabPanel activeTab={tab} tabId={TabRoutes.FEATURED}>
        <GameProfileFeatured gameId={gameId} />
      </TabPanel>
      {/* <TabPanel activeTab={tab} tabId={TabRoutes.GRAPHS}>
        <GameProfileGraphs gameId={gameId} />
      </TabPanel> */}
    </StyledGameTabs>
  );
};

const StyledGameTabs = styled.div`
  max-width: 100rem;
  width: 100%;
  flex: 1 1 100%;
  overflow: hidden;
`;
