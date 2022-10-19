import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Game } from '@masochistme/sdk/dist/v1/types';

import { useCuratedGames, useGameBadges } from 'sdk';
import { Flex, Spinner, Wrapper, Section } from 'components';
import { StackedBarChart, List, Badges } from 'containers';
import { media } from 'shared/theme';
import { useActiveTab } from 'shared/hooks';
import { TabDict } from 'shared/config/tabs';

import { GameHeader } from './GameHeader';

export const TabGame = (): JSX.Element => {
	useActiveTab(TabDict.GAME);

	const { id } = useParams<{ id: string }>();
	const gameId = Number(id);

	const { gamesData, isFetched: loaded } = useCuratedGames();
	const { gameBadgesData = [] } = useGameBadges(gameId);

	const game = gamesData.find((g: Game) => g.id === gameId);
	const gameDetails = {
		...game,
		badges: gameBadgesData,
		completions: 'TODO!!!',
		avgPlaytime: 'TODO!!!',
		avgPlaytimeForTier: 'TODO!!!',
	};

	return (
		<Flex column width="100%">
			<GameHeader game={game} />
			<Wrapper type="page">
				{loaded && game ? (
					<FlexibleFlex>
						{gameDetails.badges?.length ? <Badges gameId={gameId} /> : null}
						<FlexibleSection
							style={{
								height: '250px',
								justifyContent: 'space-between',
							}}>
							<h3 style={{ textAlign: 'center' }}>
								Completions: {gameDetails?.completions ?? 'unknown'}
								<br />
								Average completion time
							</h3>
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
