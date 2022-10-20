import React from 'react';
import styled from 'styled-components';

import { useActiveTab } from 'shared/hooks';
import { TabDict } from 'shared/config/tabs';
import { Flex } from 'components';
import {
	SubPage,
	SectionDiscord,
	SectionHistory,
	SectionSale,
	SectionTop,
	SectionTrivia,
	SectionNewGames,
	SectionNewMembers,
	SectionNewBadges,
	Section,
	SectionFeatured,
} from 'containers';

export enum SectionMap {
	WELCOME = 'welcome',
	UPDATE = 'update',
	TRIVIA = 'trivia',
	NEW_GAMES = 'newGames',
	NEW_MEMBERS = 'newMembers',
	TOP = 'top',
	HISTORY = 'history',
	SALES = 'sales',
	DISCORD = 'discord',
}

const TabHome = (): JSX.Element => {
	useActiveTab(TabDict.HOME);

	return (
		<SubPage>
			<StyledDashboard column justify>
				<Flex row gap={16}>
					<Flex column gap={16}>
						<SectionNewMembers />
						<SectionNewBadges />
						<SectionNewGames />
					</Flex>
					<Flex column gap={16}>
						<SectionFeatured />
						<Flex row alignItems="flex-start" gap={16}>
							<SectionHistory />
							<SectionTop />
						</Flex>
					</Flex>
				</Flex>
				<SectionSale />
			</StyledDashboard>
			{/* <SectionDiscord /> */}
		</SubPage>
	);
};

export default TabHome;

const SectionWelcome = () => {
	return (
		<Section
			fullWidth
			title="Development environment"
			content={
				<p style={{ padding: '0 20px' }}>
					Congratulations, you found the development environment!
				</p>
			}
		/>
	);
};

const StyledDashboard = styled(Flex)`
	width: 100%;
	align-items: flex-start;
	gap: 16px;
	flex-wrap: wrap;
`;
