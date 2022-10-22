import React from 'react';
import styled from 'styled-components';

import { media } from 'shared/theme';
import { useActiveTab } from 'shared/hooks';
import { TabDict } from 'shared/config/tabs';
import { Flex } from 'components';
import {
	SubPage,
	SectionHistory,
	SectionSale,
	SectionNewGames,
	SectionNewMembers,
	SectionNewBadges,
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
				<StyledSectionTop>
					<StyledColumnLeft>
						<SectionHistory />
						<StyledNewStuff>
							<SectionNewBadges />
							<SectionNewMembers />
						</StyledNewStuff>
					</StyledColumnLeft>
					<StyledColumnRight>
						<SectionNewGames />
						<SectionFeatured />
					</StyledColumnRight>
				</StyledSectionTop>
				<SectionSale />
			</StyledDashboard>
			{/* <SectionTop /> */}
			{/* <SectionDiscord /> */}
		</SubPage>
	);
};

export default TabHome;

const StyledDashboard = styled(Flex)`
	width: 100%;
	align-items: flex-start;
	gap: 16px;
	flex-wrap: wrap;
`;

const StyledSectionTop = styled(Flex)`
	flex-direction: row;
	justify-content: space-between;
	width: 100%;
	gap: 16px;
	@media (max-width: ${media.netbooks}) {
		flex-wrap: wrap;
	}
`;

const StyledNewStuff = styled(Flex)`
	flex-direction: column;
	gap: 16px;
	justify-content: space-evenly;
`;

const StyledColumnLeft = styled(Flex)`
	flex-direction: column;
	flex-wrap: wrap;
	max-width: 450px;
	gap: 16px;
	justify-content: space-between;
	@media (max-width: ${media.netbooks}) {
		flex-direction: row;
		width: 100%;
		max-width: 100%;
		justify-content: space-evenly;
	}
`;

const StyledColumnRight = styled(Flex)`
	max-width: 1000px;
	flex-direction: column;
	justify-content: center;
	flex-grow: 1;
	flex-wrap: wrap;
	gap: 16px;
	@media (max-width: ${media.netbooks}) {
		justify-content: space-evenly;
		max-width: 100%;
		width: 100%;
	}
`;
