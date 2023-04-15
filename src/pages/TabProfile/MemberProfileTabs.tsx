import React, { useState } from 'react';
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
import { useMixpanel } from 'hooks';

import { MemberProfileBadges } from './MemberProfileBadges';
import { MemberProfileGraphs } from './MemberProfileGraphs';
import { MemberProfileGames } from './MemberProfileGames';

enum TabsMap {
	GRAPHS = 'graphs',
	BADGES = 'badges',
	GAMES = 'games',
}

type Props = { id: string };

export const MemberProfileTabs = ({ id }: Props) => (
	<QueryBoundary fallback={<Loader />} errorFallback={<ErrorFallback />}>
		<MemberProfileTabsBoundary id={id} />
	</QueryBoundary>
);

const MemberProfileTabsBoundary = ({ id }: Props) => {
	const { track } = useMixpanel();
	const { memberData: member } = useMemberById(id);
	const [activeTab, setActiveTab] = useState<string>(TabsMap.GAMES);

	const isUserPrivate = member?.isPrivate;
	const isUserNotAMember = member && !member.isMember && !member.isProtected;

	const handleChangeTab = (_e: React.SyntheticEvent, newTab: TabsMap) => {
		setActiveTab(newTab);
		track('page.user.tab', { tab: newTab });
	};

	if (isUserPrivate)
		return (
			<Warning description="This user has their profile set to private." />
		);
	if (isUserNotAMember)
		return <Warning description="This user is not a member of the curator." />;

	return (
		<StyledMemberProfileTabs column>
			<Tabs value={activeTab} onChange={handleChangeTab}>
				<Tab label="Games" value={TabsMap.GAMES} />
				<Tab label="Badges" value={TabsMap.BADGES} />
				<Tab label="Graphs" value={TabsMap.GRAPHS} />
			</Tabs>
			<TabPanel activeTab={activeTab} tabId={TabsMap.GAMES}>
				<MemberProfileGames memberId={id} />
			</TabPanel>
			<TabPanel activeTab={activeTab} tabId={TabsMap.BADGES}>
				<MemberProfileBadges memberId={id} />
			</TabPanel>
			<TabPanel activeTab={activeTab} tabId={TabsMap.GRAPHS}>
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
