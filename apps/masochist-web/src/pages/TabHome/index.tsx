import React, { useEffect, useState } from 'react';
import { Featured } from '@masochistme/sdk/dist/v1/types';
import styled from 'styled-components';

import { media } from 'styles';
import { useFeatured } from 'sdk';
import { chooseRandomIndex } from 'utils';
import { useActiveTab } from 'hooks';
import { TabDict } from 'configuration/tabs';
import { Flex, QueryBoundary } from 'components';
import { SubPage, DashboardTile } from 'containers';

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

export const TabHome = (): JSX.Element => {
	useActiveTab(TabDict.HOME);

	return (
		<SubPage>
			<StyledDashboard column justify align>
				<QueryBoundary
					fallback={<DashboardTile.Featured.Skeleton isMobileOnly />}
					errorFallback={<DashboardTile.Featured.Error isMobileOnly />}>
					<FeaturedBoundary isMobileOnly />
				</QueryBoundary>
				<StyledSectionTop>
					<StyledColumnLeft>
						<DashboardTile.History />
						<StyledNewStuff>
							<DashboardTile.Badges />
							<DashboardTile.Members />
						</StyledNewStuff>
					</StyledColumnLeft>
					<StyledColumnRight>
						<DashboardTile.Games />
						<QueryBoundary
							fallback={<DashboardTile.Featured.Skeleton isDesktopOnly />}
							errorFallback={<DashboardTile.Featured.Error isDesktopOnly />}>
							<FeaturedBoundary isDesktopOnly />
						</QueryBoundary>
					</StyledColumnRight>
				</StyledSectionTop>
				<DashboardTile.Sale />
			</StyledDashboard>
			{/* <DashboardTile.Top /> */}
			{/* <DashboardTile.Discord /> */}
		</SubPage>
	);
};

type FeaturedBoundaryProps = {
	isDesktopOnly?: boolean;
	isMobileOnly?: boolean;
};
const FeaturedBoundary = (props: FeaturedBoundaryProps) => {
	const { isDesktopOnly = false, isMobileOnly = false } = props;
	const { featuredData, isLoading, isFetched, isError } = useFeatured();
	const [activeFeaturedIndex, setActiveFeaturedIndex] = useState<number>(0);

	useEffect(() => {
		if (isFetched)
			setActiveFeaturedIndex(chooseRandomIndex<Featured>(featuredData));
	}, [featuredData, isFetched]);

	return (
		<DashboardTile.Featured
			fullWidth
			isDesktopOnly={isDesktopOnly}
			isMobileOnly={isMobileOnly}
			featuredData={featuredData}
			isLoading={isLoading}
			isFetched={isFetched}
			isError={isError}
			activeIndex={activeFeaturedIndex}
			setActiveIndex={setActiveFeaturedIndex}
		/>
	);
};

const StyledDashboard = styled(Flex)`
	width: 100%;
	align-items: flex-start;
	gap: var(--size-16);
	flex-wrap: wrap;
`;

const StyledSectionTop = styled(Flex)`
	flex-direction: row;
	justify-content: space-between;
	width: 100%;
	gap: var(--size-16);
	@media (max-width: ${media.netbooks}) {
		flex-wrap: wrap;
	}
`;

const StyledNewStuff = styled(Flex)`
	flex-direction: column;
	gap: var(--size-16);
	justify-content: space-evenly;
`;

const StyledColumnLeft = styled(Flex)`
	flex-direction: column;
	flex-wrap: wrap;
	width: 100%;
	max-width: 45rem;
	gap: var(--size-16);
	justify-content: space-between;
	@media (max-width: ${media.netbooks}) {
		flex-direction: row;
		width: 100%;
		max-width: 100%;
		justify-content: space-evenly;
	}
`;

const StyledColumnRight = styled(Flex)`
	max-width: 100rem;
	flex-direction: column;
	justify-content: center;
	flex-grow: 1;
	flex-wrap: wrap;
	gap: var(--size-16);
	@media (max-width: ${media.netbooks}) {
		justify-content: space-evenly;
		max-width: 100%;
		width: 100%;
	}
`;
