import React, { Suspense } from 'react';
import styled from 'styled-components';

import { useActiveTab } from 'hooks';
import { TabDict } from 'shared/config/tabs';
import { useAppContext, GameView } from 'context';
import { SubPage } from 'containers';
import { Flex, Loader } from 'components';

import { GameTableView } from './GameTableView';
import { GameFilterBar } from './GameFilterBar';

const GameTileView = React.lazy(() =>
	import('./GameTileView').then(module => ({
		default: module.GameTileView,
	})),
);

const TabGames = (): JSX.Element => {
	useActiveTab(TabDict.GAMES);

	const { gameListView } = useAppContext();

	return (
		<SubPage>
			<StyledGames column>
				<GameFilterBar />
				{gameListView === GameView.TILE && (
					<Suspense fallback={<Loader />}>
						<GameTileView />
					</Suspense>
				)}
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

export default TabGames;

const StyledGames = styled(Flex)`
	width: 100%;
	flex: 1 1 100%;
`;
