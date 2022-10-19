import React from 'react';
import styled from 'styled-components';

import { useActiveTab } from 'shared/hooks';
import { TabDict } from 'shared/config/tabs';
import { useAppContext, GameView } from 'shared/store/context';
import { SubPage, Section } from 'containers';
import { Flex } from 'components';

import { GameTileView } from './GameTileView';
import { GameTableView } from './GameTableView';
import { GameFilterBar } from './GameFilterBar';

export const TabGames = (): JSX.Element => {
	useActiveTab(TabDict.GAMES);

	const { gameListView } = useAppContext();

	return (
		<SubPage>
			<StyledGames column>
				<GameFilterBar />
				{gameListView === GameView.TILE && <GameTileView />}
				{gameListView === GameView.TABLE && <GameTableView />}
			</StyledGames>
			<Section
				maxWidth="300px"
				title="MasochistME curations"
				content={
					<>
						<p>
							Here&lsquo;s the list of games that MasochistME curates, as well
							as the percentage completion comparision between our users.
						</p>
						<p>
							In the MasochistME community, we grade the ranks of our users by
							how many curated games they&lsquo;ve completed, as well as the
							difficulty of those games. Each game specifies their own
							difficulty in the description.
						</p>
						<p>
							The list also includes which three users completed the game first
							(with a gold, silver and bronze medals, respectively).
						</p>
					</>
				}></Section>
		</SubPage>
	);
};

const StyledGames = styled(Flex)`
	flex: 1 1 100%;
`;
