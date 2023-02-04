import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { useMemberById, usePatreonTiers, useMemberLeaderboards } from 'sdk';
import { Flex, Loader, QueryBoundary, Skeleton, Warning } from 'components';
import { SubPage, Tabs, Tab, TabPanel } from 'containers';
import { useActiveTab, useMixpanel } from 'hooks';
import { TabDict } from 'configuration/tabs';
import { useTheme, ColorTokens } from 'styles';

import { MemberProfileFeaturedSection } from './MemberProfileFeaturedSection';
import { MemberProfileBadgesSection } from './MemberProfileBadgesSection';
import { MemberProfileHeader } from './MemberProfileHeader';
import { MemberProfileBadges } from './MemberProfileBadges';
import { MemberProfileGraphs } from './MemberProfileGraphs';
import { MemberProfileGames } from './MemberProfileGames';
import { MemberProfileStats } from './MemberProfileStats';
import { PatreonTier, PatronTier } from '@masochistme/sdk/dist/v1/types';

enum TabsMap {
	GRAPHS = 'graphs',
	BADGES = 'badges',
	GAMES = 'games',
}

export const TabProfile = (): JSX.Element => {
	useActiveTab(TabDict.PROFILE, true);
	const { id } = useParams<{ id: string }>();

	return (
		<SubPage>
			<QueryBoundary fallback={<Loader />}>
				<ProfileBoundary id={id} />
			</QueryBoundary>
			<MemberProfileSidebar column>
				<MemberProfileBadgesSection memberId={id} />
				<MemberProfileFeaturedSection memberId={id} />
			</MemberProfileSidebar>
		</SubPage>
	);
};

const ProfileBoundary = ({ id }: { id: string }) => {
	const { colorTokens } = useTheme();
	const { track } = useMixpanel();
	const [activeTab, setActiveTab] = useState<string>(TabsMap.GAMES);

	const { leaderData } = useMemberLeaderboards(id);
	const { memberData: member, isError } = useMemberById(id);
	const { patreonTiersData } = usePatreonTiers();

	useEffect(() => {
		if (member?.name) track('tab.profile.visit', { name: member.name, id });
	}, [member]);

	const patron = (patreonTiersData.find(
		patreonTier => patreonTier.id === leaderData?.patreonTier,
	) ?? {
		description: 'Unknown',
		symbol: 'Medal',
	}) as Partial<PatreonTier>;

	const isHighestPatronTier = leaderData?.patreonTier === PatronTier.TIER4;
	const getTierColor = () => {
		if (patron?.id === PatronTier.TIER4)
			return colorTokens['semantic-color--tier-4'];
		return null;
	};

	const isUserPrivate = member?.isPrivate;
	const isUserNotAMember = member && !member.isMember && !member.isProtected;
	const canNotShowUser = isUserPrivate || isUserNotAMember;

	const handleChangeTab = (_e: React.SyntheticEvent, newTab: TabsMap) => {
		setActiveTab(newTab);
		track('page.user.tab', { tab: newTab });
	};

	if (isError)
		return (
			<SubPage>
				<Warning description={`User with id ${id} does not exist.`} />
			</SubPage>
		);

	return (
		<Flex column width="100%" gap={16}>
			<StyledMemberProfileTop
				colorTokens={colorTokens}
				isHighestPatronTier={isHighestPatronTier}
				tierColor={getTierColor()}>
				<MemberProfileHeader memberId={id} patron={patron} />
				<MemberProfileStats memberId={id} patron={patron} />
			</StyledMemberProfileTop>
			{isUserPrivate && (
				<Warning description="This user has their profile set to private." />
			)}
			{isUserNotAMember && (
				<Warning description="This user is not a member of the curator." />
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
	);
};

const StyledProfile = styled(Flex)`
	width: 100%;
	flex: 1 1 100%;
	overflow: hidden;
`;

const StyledMemberProfileTop = styled(Flex)<{
	colorTokens: ColorTokens;
	isHighestPatronTier?: boolean;
	tierColor: string | null;
}>`
	flex-direction: column;
	background-color: ${({ colorTokens, isHighestPatronTier }) => {
		if (isHighestPatronTier)
			return `${colorTokens['semantic-color--tier-4']}33`;
		return `${colorTokens['core-tertiary-bg']}}66`;
	}};
	border-radius: 16px;
	${({ tierColor }) => `border: 2px solid ${tierColor}`};
`;

const MemberProfileSidebar = styled(Flex)`
	width: 100%;
	max-width: 450px;
	gap: 8px;
`;
