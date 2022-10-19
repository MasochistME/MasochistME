import React from 'react';
import styled from 'styled-components';
import { Tier } from '@masochistme/sdk/dist/v1/types';

import { useAppContext, GameView } from 'shared/store/context';
import { SubPage, Section, SearchBar } from 'containers';
import { Flex, HoverIcon, Spinner } from 'components';
import { useActiveTab } from 'shared/hooks';
import { TabDict } from 'shared/config/tabs';
import { useCuratedGames, useTiers } from 'sdk';

import { CheckBoxGameChoice } from './CheckBoxGameChoice';
import { GameTiles } from './GameTiles';
import { GameList } from './GameList';

export const TabGames = (): JSX.Element => {
	useActiveTab(TabDict.GAMES);
	const { gameListView, setGameListView } = useAppContext();
	const { isLoading: isGamesLoading, isFetched: isGamesFetched } =
		useCuratedGames();
	const {
		tiersData,
		isLoading: isTiersLoading,
		isFetched: isTiersFetched,
	} = useTiers();

	const isFetched = isGamesFetched && isTiersFetched;
	const isLoading = isGamesLoading && isTiersLoading;

	const onGameViewClick = () => {
		if (gameListView === GameView.TILE) setGameListView(GameView.LIST);
		if (gameListView === GameView.LIST) setGameListView(GameView.TILE);
	};

	return (
		<SubPage>
			<StyledGames>
				{isLoading && <Spinner />}
				{isFetched && (
					<>
						<Flex row align justifyContent="space-between">
							<div className="wrapper-choicebar">
								{tiersData.map((tier: Tier) => (
									<CheckBoxGameChoice
										key={`checkbox-game-${tier.id}`}
										tier={tier.id}
									/>
								))}
							</div>
							<SearchBar />
							<HoverIcon
								type="fas fa-th-list"
								isActive={gameListView === GameView.LIST}
								onClick={onGameViewClick}
							/>
						</Flex>
						{gameListView === GameView.TILE && <GameTiles />}
						{gameListView === GameView.LIST && <GameList />}
					</>
				)}
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

const StyledGames = styled.div`
	flex: 1 1 100%;
`;
