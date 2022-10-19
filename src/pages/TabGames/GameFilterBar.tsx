import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Tier } from '@masochistme/sdk/dist/v1/types';

import { useAppContext, GameView } from 'shared/store/context';
import { SearchBar } from 'containers';
import { Button, FilterBar, Flex, Spinner } from 'components';
import { useActiveTab } from 'shared/hooks';
import { TabDict } from 'shared/config/tabs';
import { useTiers } from 'sdk';

import { GameTierCheckbox } from './GameTierCheckbox';

export const GameFilterBar = (): JSX.Element => {
	useActiveTab(TabDict.GAMES);

	const { queryGame, setQueryGame, gameListView, setGameListView } =
		useAppContext();
	const {
		tiersData,
		isLoading: isTiersLoading,
		isFetched: isTiersFetched,
	} = useTiers();

	const gameViewButtonIcon = useMemo(() => {
		if (gameListView === GameView.TILE) return 'fas fa-table';
		if (gameListView === GameView.TABLE) 'fas fa-grip-horizontal';
		return 'fas fa-circle-notch fa-spin';
	}, [gameListView]);

	const gameViewButtonLabel = useMemo(() => {
		if (gameListView === GameView.TILE) return 'Toggle table view';
		else return 'Toggle grid view';
	}, [gameListView]);

	const onGameViewClick = () => {
		if (gameListView === GameView.TILE) setGameListView(GameView.TABLE);
		if (gameListView === GameView.TABLE) setGameListView(GameView.TILE);
	};

	return (
		<FilterBar>
			<SearchBar
				placeholder="Search games"
				query={queryGame}
				setQuery={setQueryGame}
			/>
			<StyledFilterGameTiers>
				{isTiersLoading && <Spinner />}
				{isTiersFetched &&
					tiersData.map((tier: Tier) => (
						<GameTierCheckbox
							tierId={tier.id}
							key={`checkbox-game-${tier.id}`}
						/>
					))}
			</StyledFilterGameTiers>
			<Button
				onClick={onGameViewClick}
				icon={gameViewButtonIcon}
				label={gameViewButtonLabel}
			/>
		</FilterBar>
	);
};

const StyledFilterGameTiers = styled(Flex)`
	justify-content: center;
	gap: 12px;
`;
