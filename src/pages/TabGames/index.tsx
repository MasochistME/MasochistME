import React from 'react';
import styled from 'styled-components';

import { useActiveTab, GameView, useToggleView } from 'hooks';
import { TabDict } from 'configuration/tabs';
import { SubPage } from 'containers';
import { Flex } from 'components';

import { GameTableView } from './GameTableView';
import { GameFilterBar } from './GameFilterBar';
import { GameTileView } from './GameTileView';

export const TabGames = () => {
	useActiveTab(TabDict.GAMES);
	const { gameListView, toggleGameView } = useToggleView();

	return (
		<SubPage>
			<StyledGames column>
				<GameFilterBar
					gameListView={gameListView}
					toggleGameView={toggleGameView}
				/>
				{gameListView === GameView.TILE && <GameTileView />}
				{gameListView === GameView.TABLE && <GameTableView />}
			</StyledGames>
		</SubPage>
	);
};

// /**
// * This is temporarily disabled since there is no use for it.
// * Might be reenabled in the future where game events are introduced.
// */
// const TabGamesInfo = (props: Partial<SectionProps>): JSX.Element => {
// 	return (
// 		<Section
// 			{...props}
// 			title="MasochistME curations"
// 			content={
// 				<Flex column gap={8}>
// 					<div>
// 						Here&lsquo;s the list of games that MasochistME curates, as well as
// 						the percentage completion comparision between our users.
// 					</div>
// 					<div>
// 						In the MasochistME community, we grade the ranks of our users by how
// 						many curated games they&lsquo;ve completed, as well as the
// 						difficulty of those games. Each game specifies their own difficulty
// 						in the description.
// 					</div>
// 					<div>
// 						The list also includes which three users completed the game first
// 						(with a gold, silver and bronze medals, respectively).
// 					</div>
// 				</Flex>
// 			}
// 		/>
// 	);
// };

const StyledGames = styled(Flex)`
	width: 100%;
	flex: 1 1 100%;
`;
