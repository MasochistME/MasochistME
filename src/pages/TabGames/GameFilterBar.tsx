import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Tier } from '@masochistme/sdk/dist/v1/types';

import { media } from 'styles';
import { useAppContext } from 'context';
import { Input } from 'containers';
import {
	Button,
	Checkbox,
	FilterBar,
	Flex,
	IconType,
	QueryBoundary,
	Skeleton,
	Spinner,
} from 'components';
import { useActiveTab, GameView, useLoadTiers } from 'hooks';
import { TabDict } from 'configuration/tabs';
import { useTiers } from 'sdk';

type Props = {
	gameListView: GameView;
	toggleGameView: () => void;
};

export const GameFilterBar = (props: Props): JSX.Element => {
	useActiveTab(TabDict.GAMES);

	const { gameListView, toggleGameView } = props;
	const { queryGame, setQueryGame } = useAppContext();

	const gameViewButtonIcon = useMemo(() => {
		if (gameListView === GameView.TILE) return 'Table';
		if (gameListView === GameView.TABLE) return 'Grid';
		return 'Spin';
	}, [gameListView]);

	const gameViewButtonLabel = useMemo(() => {
		if (gameListView === GameView.TILE) return 'Toggle table view';
		else return 'Toggle grid view';
	}, [gameListView]);

	return (
		<FilterBar>
			<StyledGameFilterBar>
				<Input
					placeholder="Search games"
					query={queryGame}
					setQuery={setQueryGame}
				/>
				<QueryBoundary
					fallback={<Spinner />}
					errorFallback={<>Could not load :c</>}>
					<TierFilterBoundary />
				</QueryBoundary>
			</StyledGameFilterBar>
			<Button
				onClick={toggleGameView}
				icon={gameViewButtonIcon}
				label={gameViewButtonLabel}
			/>
		</FilterBar>
	);
};

const TierFilterBoundary = () => {
	useLoadTiers();
	const { visibleTiers, setVisibleTiers } = useAppContext();
	const { tiersData } = useTiers();

	return (
		<StyledGameFilterBarTiers>
			{tiersData.map((tier: Tier) => (
				<Checkbox
					key={`checkbox-filter-${tier.id}`}
					icon={tier.icon as IconType}
					itemType={tier.id}
					visibleItems={visibleTiers}
					setVisibleItems={setVisibleTiers}
				/>
			))}
		</StyledGameFilterBarTiers>
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
