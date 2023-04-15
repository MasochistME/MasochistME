import React from 'react';
import styled from 'styled-components';

import { useActiveTab, GameView, useToggleView } from 'hooks';
import { TabDict } from 'configuration/tabs';
import { Section, SectionProps, SubPage } from 'containers';
import {
	ErrorFallback,
	Flex,
	Icon,
	IconType,
	Loader,
	QueryBoundary,
	Size,
} from 'components';

import { GameTableView } from './GameTableView';
import { GameFilterBar } from './GameFilterBar';
import { GameTileView } from './GameTileView';
import { useTiers } from 'sdk';
import { Tier } from '@masochistme/sdk/dist/v1/types';
import { Link } from 'react-router-dom';

export const TabGames = () => {
	useActiveTab(TabDict.GAMES);
	const { gameListView, toggleGameView } = useToggleView();

	return (
		<SubPage>
			<StyledGames column>
				<Info isMobileOnly />
				<GameFilterBar
					gameListView={gameListView}
					toggleGameView={toggleGameView}
				/>
				{gameListView === GameView.TILE && <GameTileView />}
				{gameListView === GameView.TABLE && <GameTableView />}
			</StyledGames>
			<Info isDesktopOnly minWidth="25rem" maxWidth="45rem" />
		</SubPage>
	);
};

const Info = (props: Partial<SectionProps>) => (
	<Section
		title="Curated games"
		content={
			<QueryBoundary fallback={<Loader />} errorFallback={<ErrorFallback />}>
				<InfoBoundary />
			</QueryBoundary>
		}
		{...props}
	/>
);

const InfoBoundary = (): JSX.Element => {
	const { tiersData } = useTiers();

	const tiersDescriptions = tiersData.map((tier: Tier) => (
		<Flex key={`tier-${String(tier._id)}`} gap={4}>
			<Icon icon={tier.icon as IconType} size={Size.MICRO} /> - {tier.score} pts
			- {tier?.description}
		</Flex>
	));

	return (
		<Flex column gap={8}>
			<div>
				MasochistME curates games that pose a challenge and are unique in some
				way. We also try to evaluate them by difficulty. Our rating system is
				based on {tiersData?.length ?? 'X'} tiers, each marked with a symbol and
				assigned a fixed amount of points for completing it:
			</div>
			<StyledTierTypes>{tiersDescriptions}</StyledTierTypes>
			<div>
				Games can also have <Link to={`/badges`}>badges</Link>, given for
				completing additional feats.
			</div>
		</Flex>
	);
};

const StyledGames = styled(Flex)`
	width: 100%;
	flex: 1 1 100%;
`;

const StyledTierTypes = styled(Flex)`
	flex-direction: column;
	align-items: flex-start;
	gap: var(--size-8);
	margin-left: var(--size-12);
	line-height: var(--size-15);
	text-align: left;
`;
