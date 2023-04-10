import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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

enum TabRoutes {
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
	const [activeTab, setActiveTab] = useState<string>(TabRoutes.GAMES);

	const isUserPrivate = member?.isPrivate;
	const isUserNotAMember = member && !member.isMember && !member.isProtected;

	const handleChangeTab = (_e: React.SyntheticEvent, newTab: TabRoutes) => {
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
				<Tab label="Games" value={TabRoutes.GAMES} to={TabRoutes.GAMES} />
				<Tab label="Badges" value={TabRoutes.BADGES} to={TabRoutes.BADGES} />
				<Tab label="Graphs" value={TabRoutes.GRAPHS} to={TabRoutes.GRAPHS} />
			</Tabs>

			<Routes>
				<Route
					path={TabRoutes.GAMES}
					element={
						<TabPanel activeTab={activeTab} tabId={TabRoutes.GAMES}>
							<MemberProfileGames memberId={id} />
						</TabPanel>
					}
				/>
				<Route
					path={TabRoutes.BADGES}
					element={
						<TabPanel activeTab={activeTab} tabId={TabRoutes.BADGES}>
							<MemberProfileBadges memberId={id} />
						</TabPanel>
					}
				/>
				<Route
					path={TabRoutes.GRAPHS}
					element={
						<TabPanel activeTab={activeTab} tabId={TabRoutes.GRAPHS}>
							<MemberProfileGraphs memberId={id} />
						</TabPanel>
					}
				/>
				<Route path="/" element={<Navigate to={TabRoutes.GAMES} />} />
			</Routes>
		</StyledMemberProfileTabs>
	);
};

const StyledMemberProfileTabs = styled(Flex)`
	width: 100%;
	flex: 1 1 100%;
	overflow: hidden;
`;
