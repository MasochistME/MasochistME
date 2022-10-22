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
import { MemberProfileStats } from './MemberProfileStats';

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
			<Flex column width="100%" gap={16}>
				<Flex column>
					<MemberProfileHeader memberId={id} />
					<MemberProfileStats memberId={id} />
				</Flex>
				{isUserPrivate && (
					<Warning description="This user has their profile set to private." />
				)}
				{isUserNotAMember && (
					<Warning description="This user is no longer a member of the curator." />
				)}
				<StyledProfile column>
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
			</Flex>
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
