import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Game, Badge } from '@masochistme/sdk/dist/v1/types';

import { useCuratedGames, useGameBadges } from 'sdk';
import { Flex, Spinner, Warning } from 'components';
import { SubPage, Section, List, BadgeTile } from 'containers';
import { useActiveTab } from 'shared/hooks';
import { TabDict } from 'shared/config/tabs';

import { GameHeader } from './GameHeader';
import { GameChart } from './GameChart';

const TabGame = (): JSX.Element => {
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

	if (!game)
		return (
			<SubPage>
				<Warning description={`Game with id ${id} does not exist.`} />
			</SubPage>
		);
	return (
		<SubPage>
			<Flex column width="100%">
				<GameHeader game={game} />
				<StyledGameStats>
					<Flex row width="100%" gap={16} alignItems="flex-start">
						{isGamesLoading && <Spinner />}
						{isGamesFetched && <GameChart gameId={gameId} />}
					</Flex>
					{isGamesLoading && <Spinner />}
					{isGamesFetched && <List game={game} />}
				</StyledGameStats>
			</Flex>
			<Section
				minWidth="450px"
				maxWidth="450px"
				title="Badges"
				content={
					<Flex column gap={4}>
						{isGameBadgesLoading && <Spinner />}
						{isGameBadgesFetched && gameBadgesData.length
							? gameBadgesData.map((badge: Badge) => (
									<BadgeTile badge={badge} key={`badge-${badge._id}`} />
							  ))
							: 'This game has no badges yet.'}
					</Flex>
				}
			/>
		</SubPage>
	);
};

export default TabGame;

const StyledGameStats = styled.div`
	width: 100%;
	flex: 1 1 100%;
`;
