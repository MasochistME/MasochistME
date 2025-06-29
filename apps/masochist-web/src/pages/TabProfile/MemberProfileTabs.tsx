import React from 'react';
import styled from 'styled-components';

import { useMemberById } from 'sdk';
import {
  ErrorFallback,
  Flex,
  Loader,
  QueryBoundary,
  Warning,
} from 'components';
import { Tabs, Tab, TabPanel } from 'containers';
import { useContextualRouting } from 'hooks';

import { MemberProfileBadges } from './MemberProfileBadges';
import { MemberProfileGraphs } from './MemberProfileGraphs';
import { MemberProfileGames } from './MemberProfileGames';
// import { MemberProfileAwards } from './MemberProfileAwards';

enum TabRoutes {
  GRAPHS = 'graphs',
  BADGES = 'badges',
  AWARDS = 'awards',
  GAMES = 'games',
}

type Props = { id: string };

export const MemberProfileTabs = ({ id }: Props) => (
  <QueryBoundary fallback={<Loader />} errorFallback={<ErrorFallback />}>
    <MemberProfileTabsBoundary id={id} />
  </QueryBoundary>
);

const MemberProfileTabsBoundary = ({ id }: Props) => {
  const { navigateToRoute, route: tab } = useContextualRouting<TabRoutes>({
    key: 'tab',
    value: TabRoutes.GAMES,
  });

  const { memberData: member } = useMemberById(id);
  const isUserPrivate = member?.isPrivate;
  const isUserNotAMember = member && !member.isMember && !member.isProtected;

  const handleChangeTab = (_e: React.SyntheticEvent, newTab: TabRoutes) => {
    navigateToRoute({ tab: newTab });
  };

  if (isUserPrivate)
    return (
      <Warning description="This user has their profile set to private." />
    );
  if (isUserNotAMember)
    return <Warning description="This user is not a member of the curator." />;

  return (
    <StyledMemberProfileTabs column>
      <Tabs value={tab} onChange={handleChangeTab}>
        <Tab label="Games" value={TabRoutes.GAMES} />
        <Tab label="Badges" value={TabRoutes.BADGES} />
        {/* <Tab label="Awards" value={TabRoutes.AWARDS} /> */}
        <Tab label="Graphs" value={TabRoutes.GRAPHS} />
      </Tabs>

      <TabPanel activeTab={tab} tabId={TabRoutes.GAMES}>
        <MemberProfileGames memberId={id} />
      </TabPanel>
      <TabPanel activeTab={tab} tabId={TabRoutes.BADGES}>
        <MemberProfileBadges memberId={id} />
      </TabPanel>
      {/* <TabPanel activeTab={tab} tabId={TabRoutes.AWARDS}>
				<MemberProfileAwards memberId={id} />
			</TabPanel> */}
      <TabPanel activeTab={tab} tabId={TabRoutes.GRAPHS}>
        <MemberProfileGraphs memberId={id} />
      </TabPanel>
    </StyledMemberProfileTabs>
  );
};

const StyledMemberProfileTabs = styled(Flex)`
  width: 100%;
  flex: 1 1 100%;
  overflow: hidden;
`;
