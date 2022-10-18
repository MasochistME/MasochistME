import React from 'react';
import styled from 'styled-components';

import { useActiveTab } from 'shared/hooks';
import { TabDict } from 'shared/config/tabs';
import { Flex } from 'components';
import {
	SectionDiscord,
	SectionHistory,
	SectionSale,
	SectionTop,
	SectionTrivia,
	SectionNewGames,
	SectionNewMembers,
	Section,
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

const sectionMap = [
	// SectionMap.TRIVIA,
	SectionMap.WELCOME,
	SectionMap.NEW_GAMES,
	SectionMap.NEW_MEMBERS,
	SectionMap.TOP,
	SectionMap.HISTORY,

	SectionMap.SALES,
	// SectionMap.DISCORD,
];

export const TabHome = (): JSX.Element => {
	useActiveTab(TabDict.HOME);

	const sections = sectionMap.map((section: SectionMap) => {
		if (section === SectionMap.WELCOME) return <SectionWelcome />;
		if (section === SectionMap.TRIVIA) return <SectionTrivia />;
		if (section === SectionMap.TOP) return <SectionTop />;
		if (section === SectionMap.HISTORY) return <SectionHistory />;
		if (section === SectionMap.NEW_GAMES) return <SectionNewGames />;
		if (section === SectionMap.NEW_MEMBERS) return <SectionNewMembers />;
		if (section === SectionMap.SALES) return <SectionSale />;
		if (section === SectionMap.DISCORD) return <SectionDiscord />;
	});

	return (
		<Flex row style={{ gap: '16px', alignItems: 'flex-start', width: '100%' }}>
			<StyledDashboard row justify>
				{sections}
			</StyledDashboard>
			{/* <SectionDiscord /> */}
		</Flex>
	);
};

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
	align-items: flex-start;
	gap: 16px;
	flex-wrap: wrap;
`;
