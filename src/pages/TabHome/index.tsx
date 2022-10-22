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
			<StyledDashboard column justify align>
				<Flex
					row
					flexWrap="wrap"
					justifyContent="space-between"
					width="100%"
					gap={16}>
					<Flex
						column
						flexWrap="wrap"
						flexGrow={1}
						maxWidth="450px"
						justifyContent={'space-between'}>
						<SectionHistory />
						<SectionNewBadges />
						<SectionNewMembers />
					</Flex>
					<Flex column justify flexGrow={1} flexWrap="wrap" gap={16}>
						<SectionNewGames />
						<SectionFeatured />
					</Flex>
				</Flex>
				<SectionSale />
			</StyledDashboard>
			{/* <SectionTop /> */}
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
