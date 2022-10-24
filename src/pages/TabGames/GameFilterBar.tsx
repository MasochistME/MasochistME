import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Tier } from '@masochistme/sdk/dist/v1/types';

import { media } from 'shared/theme';
import { useAppContext, GameView } from 'context';
import { SearchBar } from 'containers';
import { Button, Checkbox, FilterBar, Flex, Spinner } from 'components';
import { useActiveTab } from 'shared/hooks';
import { TabDict } from 'shared/config/tabs';
import { useTiers } from 'sdk';

export const GameFilterBar = (): JSX.Element => {
	useActiveTab(TabDict.GAMES);

	const {
		queryGame,
		setQueryGame,
		gameListView,
		setGameListView,
		visibleTiers,
		setVisibleTiers,
	} = useAppContext();
	const {
		tiersData,
		isLoading: isTiersLoading,
		isFetched: isTiersFetched,
	} = useTiers();

	const gameViewButtonIcon = useMemo(() => {
		if (gameListView === GameView.TILE) return 'fas fa-table';
		if (gameListView === GameView.TABLE) return 'fas fa-grip-horizontal';
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
			<StyledGameFilterBar>
				<SearchBar
					placeholder="Search games"
					query={queryGame}
					setQuery={setQueryGame}
				/>
				<StyledGameFilterBarTiers>
					{isTiersLoading && <Spinner />}
					{isTiersFetched &&
						tiersData.map((tier: Tier) => (
							<Checkbox
								icon={tier.icon}
								itemType={tier.id}
								visibleItems={visibleTiers}
								setVisibleItems={setVisibleTiers}
							/>
						))}
				</StyledGameFilterBarTiers>
			</StyledGameFilterBar>
			<Button
				onClick={onGameViewClick}
				icon={gameViewButtonIcon}
				label={gameViewButtonLabel}
			/>
		</FilterBar>
	);
};

const StyledGameFilterBar = styled(Flex)`
	gap: 16px;
	flex-wrap: wrap;
	@media (max-width: ${media.smallNetbooks}) {
		justify-content: center;
	}
`;

const StyledGameFilterBarTiers = styled(Flex)`
	justify-content: center;
	gap: 24px;
`;
