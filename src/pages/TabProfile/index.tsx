import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { useMemberById } from 'sdk';
import { Flex, Warning } from 'components';
import { SubPage, Tabs, Tab, TabPanel } from 'containers';
import { useActiveTab } from 'shared/hooks';
import { TabDict } from 'shared/config/tabs';

import { MemberProfileBadgesSection } from './MemberProfileBadgesSection';
import { MemberProfileHeader } from './MemberProfileHeader';
import { MemberProfileBadges } from './MemberProfileBadges';
import { MemberProfileGraphs } from './MemberProfileGraphs';
import { MemberProfileGames } from './MemberProfileGames';

enum TabsMap {
	GRAPHS = 'graphs',
	BADGES = 'badges',
	GAMES = 'games',
}

const TabProfile = (): JSX.Element => {
	useActiveTab(TabDict.PROFILE);
	const [activeTab, setActiveTab] = useState<string>(TabsMap.GAMES);
	const { id } = useParams<{ id: string }>();
	const { memberData: member, isError } = useMemberById(id);

	const isUserPrivate = member?.isPrivate;
	const isUserNotAMember = member && !member.isMember && !member.isProtected;
	const canNotShowUser = isUserPrivate || isUserNotAMember;

	const handleChangeTab = (_e: React.SyntheticEvent, newTab: TabsMap) => {
		setActiveTab(newTab);
	};

	if (isError)
		return (
			<SubPage>
				<Warning description={`User with id ${id} does not exist.`} />
			</SubPage>
		);

	return (
		<SubPage>
			<StyledProfile column>
				<MemberProfileHeader memberId={id} />
				<Warning description="TODO: Add some kind of points summary here" />
				{isUserPrivate && (
					<Warning description="This user has their profile set to private." />
				)}
				{isUserNotAMember && (
					<Warning description="This user is no longer a member of the curator." />
				)}
				{!canNotShowUser && (
					<>
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
					</>
				)}
			</StyledProfile>
			<MemberProfileBadgesSection memberId={id} />
		</SubPage>
	);
};

export default TabProfile;

const StyledProfile = styled(Flex)`
	width: 100%;
	flex: 1 1 100%;
	overflow: hidden;
`;
