import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Game, Badge } from '@masochistme/sdk/dist/v1/types';

import { useCuratedGames, useGameBadges } from 'sdk';
import { Flex, Spinner } from 'components';
import { SubPage, Section, StackedBarChart, List, BadgeTile } from 'containers';
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
		isLoading: isGameBadgesLoading,
		isFetched: isGameBadgesFetched,
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
		<SubPage>
			<Flex column width="100%">
				<GameHeader game={game} />
				<StyledGameStats>
					<Flex row width="100%" gap={16} alignItems="flex-start">
						{isGamesLoading && <Spinner />}
						{isGamesFetched && (
							<Section
								fullWidth
								title={`Completions: ${
									gameDetails?.completions ?? 'unknown'
								} - average completion time`}
								content={
									'Charts go here'
									// <StackedBarChart
									// 	labels={['hours']}
									// 	datasets={[
									// 		{
									// 			label: 'this game',
									// 			data: [gameDetails.avgPlaytime],
									// 			colorNormal: '#e30000ff',
									// 			colorTransparent: '#e3000033',
									// 		},
									// 		{
									// 			label: 'games from this tier',
									// 			data: [gameDetails?.avgPlaytimeForTier ?? 0],
									// 			colorNormal: '#141620ff',
									// 			colorTransparent: '#14162066',
									// 		},
									// 	]}
									// />
								}
							/>
						)}
					</Flex>
					{isGamesLoading && <Spinner />}
					{isGamesFetched && <List game={game} />}
				</StyledGameStats>
			</Flex>
			<Section
				maxWidth="300px"
				title="Badges"
				content={
					<Flex column gap={4}>
						{isGameBadgesLoading && <Spinner />}
						{isGameBadgesFetched &&
							gameBadgesData.map((badge: Badge) => (
								<BadgeTile badge={badge} key={`badge-${badge._id}`} />
							))}
					</Flex>
				}
			/>
		</SubPage>
	);
};

const StyledGameStats = styled.div`
	width: 100%;
	flex: 1 1 100%;
`;
