import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Game } from '@masochistme/sdk/dist/v1/types';

import { useCuratedGames, useGameBadges } from 'sdk';
import { Flex, Spinner } from 'components';
import { SubPage, Section, StackedBarChart, List, Badges } from 'containers';
import { media } from 'shared/theme';
import { useActiveTab } from 'shared/hooks';
import { TabDict } from 'shared/config/tabs';

import { GameHeader } from './GameHeader';

export const TabGame = (): JSX.Element => {
	useActiveTab(TabDict.GAME);

	const { id } = useParams<{ id: string }>();
	const gameId = Number(id);

	const {
		gamesData,
		isLoading: isGamesLoading,
		isFetched: isGamesFetched,
	} = useCuratedGames();
	const {
		gameBadgesData = [],
		isLoading: isBadgesLoading,
		isFetched: isBadgesFetched,
	} = useGameBadges(gameId);

	const game = gamesData.find((g: Game) => g.id === gameId);
	const gameDetails = {
		...game,
		badges: gameBadgesData,
		completions: 'TODO!!!',
		avgPlaytime: 'TODO!!!',
		avgPlaytimeForTier: 'TODO!!!',
	};

	return (
		<SubPage flexDirection="column">
			<GameHeader game={game} />
			<StyledGameStats>
				<Flex row width="100%" gap={16} alignItems="flex-start">
					{isBadgesLoading && <Spinner />}
					{isBadgesFetched && gameDetails.badges?.length !== 0 && (
						<Badges gameId={gameId} />
					)}
					{isGamesLoading && <Spinner />}
					{isGamesFetched && (
						<Section
							fullWidth
							title={`Completions: ${
								gameDetails?.completions ?? 'unknown'
							} - average completion time`}
							content={
								<StackedBarChart
									labels={['hours']}
									datasets={[
										{
											label: 'this game',
											data: [gameDetails.avgPlaytime],
											colorNormal: '#e30000ff',
											colorTransparent: '#e3000033',
										},
										{
											label: 'games from this tier',
											data: [gameDetails?.avgPlaytimeForTier ?? 0],
											colorNormal: '#141620ff',
											colorTransparent: '#14162066',
										},
									]}
								/>
							}
						/>
					)}
				</Flex>
				{isGamesLoading && <Spinner />}
				{isGamesFetched && <List game={game} />}
			</StyledGameStats>
		</SubPage>
	);
};

const StyledGameStats = styled.div`
	width: 100%;
	flex: 1 1 100%;
`;

// const FlexibleFlex = styled(Flex)`
// 	width: 100%;
// 	margin-bottom: 16px;
// 	@media (max-width: ${media.smallNetbooks}) {
// 		flex-direction: column;
// 	}
// `;

// const FlexibleSection = styled(Section)`
// 	@media (min-width: ${media.smallNetbooks}) {
// 		width: 100%;
// 	}
// `;
