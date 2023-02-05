import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { useMemberById, usePatreonTiers, useMemberLeaderboards } from 'sdk';
import {
	ErrorFallback,
	Flex,
	Loader,
	QueryBoundary,
	Warning,
} from 'components';
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
			<QueryBoundary
				fallback={
					<Flex align justify width="100%">
						<Loader />
					</Flex>
				}
				errorFallback={
					<Warning description={`User with id ${id} does not exist.`} />
				}>
				<TabProfileBoundary id={id} />
				<MemberProfileSidebar column>
					<MemberProfileBadgesSection memberId={id} />
					<MemberProfileFeaturedSection memberId={id} />
				</MemberProfileSidebar>
			</QueryBoundary>
		</SubPage>
	);
};

const TabProfileBoundary = ({ id }: { id: string }) => {
	const { track } = useMixpanel();
	const { memberData: member } = useMemberById(id);

	useEffect(() => {
		if (member?.name) track('tab.profile.visit', { name: member.name, id });
	}, [member]);

	return (
		<Flex column width="100%" gap={16}>
			<QueryBoundary fallback={<Loader />} errorFallback={<ErrorFallback />}>
				<TabProfileTopBoundary id={id} />
			</QueryBoundary>
			<QueryBoundary fallback={<Loader />} errorFallback={<ErrorFallback />}>
				<TabProfileTabsBoundary id={id} />
			</QueryBoundary>
		</Flex>
	);
};

const TabProfileTopBoundary = ({ id }: { id: string }) => {
	const { colorTokens } = useTheme();

	const { leaderData } = useMemberLeaderboards(id);
	const { patreonTiersData } = usePatreonTiers();

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

	return (
		<StyledMemberProfileTop
			colorTokens={colorTokens}
			isHighestPatronTier={isHighestPatronTier}
			tierColor={getTierColor()}>
			<MemberProfileHeader memberId={id} patron={patron} />
			<MemberProfileStats memberId={id} patron={patron} />
		</StyledMemberProfileTop>
	);
};

const TabProfileTabsBoundary = ({ id }: { id: string }) => {
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
		<StyledProfile column>
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
		</StyledProfile>
	);
};

/**
 * COMPONENTS
 */

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
		return `${colorTokens['core-tertiary-bg']}cc`;
	}};
	color: ${({ colorTokens, isHighestPatronTier }) => {
		if (isHighestPatronTier) return `${colorTokens['semantic-color--tier-4']}`;
		return `inherit`;
	}};
	border-radius: 16px;
	${({ tierColor }) => `border: 2px solid ${tierColor}`};
`;

const MemberProfileSidebar = styled(Flex)`
	width: 100%;
	max-width: 450px;
	gap: 8px;
`;
