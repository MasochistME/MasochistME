import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { media } from 'shared/theme';
import { useActiveTab } from 'shared/hooks';
import { useGames, useGameBadges } from 'sdk';
import { Flex, Spinner, Wrapper, Section } from 'components';
import { StackedBarChart, List, Badges } from 'containers';
import GameHeader from './GameHeader';
import { TabDict } from 'shared/config/tabs';
import { Game } from '@masochistme/sdk/dist/v1/types';

export const TabGame = (): JSX.Element => {
	useActiveTab(TabDict.GAME);

	const { id } = useParams<{ id: string }>();
	const gameId = Number(id);

	const { gamesData, isFetched: loaded } = useGames();
	const { gameBadgesData = [] } = useGameBadges(gameId);

	const game = {
		...gamesData.find((g: Game) => g.id === gameId),
		badges: gameBadgesData,
		completions: 'TODO!!!',
		avgPlaytime: 'TODO!!!',
		avgPlaytimeForTier: 'TODO!!!',
	};

	return (
		<Flex column>
			<GameHeader game={game} />
			<Wrapper type="page">
				{loaded && game ? (
					<FlexibleFlex>
						{game.badges?.length ? <Badges gameId={gameId} /> : null}
						<FlexibleSection
							style={{
								height: '250px',
								justifyContent: 'space-between',
							}}>
							<h3 style={{ textAlign: 'center' }}>
								Completions: {game?.completions ?? 'unknown'}
								<br />
								Average completion time
							</h3>
							<StackedBarChart
								labels={['hours']}
								datasets={[
									{
										label: 'this game',
										data: [game.avgPlaytime],
										colorNormal: '#e30000ff',
										colorTransparent: '#e3000033',
									},
									{
										label: 'games from this tier',
										data: [game?.avgPlaytimeForTier ?? 0],
										colorNormal: '#141620ff',
										colorTransparent: '#14162066',
									},
								]}
							/>
						</FlexibleSection>
					</FlexibleFlex>
				) : (
					<Spinner />
				)}
				{game ? <List game={game} /> : <Spinner />}
			</Wrapper>
		</Flex>
	);
};

const FlexibleFlex = styled(Flex)`
	width: 100%;
	margin-bottom: 16px;
	@media (max-width: ${media.smallNetbooks}) {
		flex-direction: column;
	}
`;

const FlexibleSection = styled(Section)`
	@media (min-width: ${media.smallNetbooks}) {
		width: 100%;
	}
`;
