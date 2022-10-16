import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { media } from 'shared/theme';
import { useActiveTab, useGameDetails } from 'shared/hooks';
import { Flex, Spinner, Wrapper, Section } from 'components';
import { StackedBarChart, List, Badges } from 'containers';
import GameHeader from './GameHeader';
import { TabDict } from 'shared/config/tabs';

export const TabGame = (): JSX.Element => {
	useActiveTab(TabDict.GAME);

	const { id } = useParams<{ id: string }>();
	const loaded = useGameDetails(id);
	const game = useSelector((state: any) => {
		const gameBasic = state.games.list.find(
			(g: any) => Number(g.id) === Number(id),
		);
		const gameDetails = state.games.details.find(
			(g: any) => Number(g.id) === Number(id),
		);
		return {
			...gameBasic,
			...gameDetails,
		};
	});

	return (
		<Flex column>
			<GameHeader game={game} />
			<Wrapper type="page">
				{loaded && game ? (
					<FlexibleFlex>
						{game.badges?.length ? <Badges game={game} /> : null}
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
