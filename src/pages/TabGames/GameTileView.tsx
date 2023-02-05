import React from 'react';
import styled from 'styled-components';
import { Game, TierId } from '@masochistme/sdk/dist/v1/types';

import { useCuratedGames } from 'sdk';
import { useAppContext } from 'context';
import { QueryBoundary, ErrorFallback } from 'components';
import { GameTile } from 'containers';

export const GameTileView = () => (
	<QueryBoundary
		fallback={<GameTileViewSkeleton />}
		errorFallback={<ErrorFallback />}>
		<GameTileViewBoundary />
	</QueryBoundary>
);

const GameTileViewBoundary = () => {
	const { visibleTiers, queryGame } = useAppContext();
	const { gamesData } = useCuratedGames();

	const filteredGames = gamesData
		.map((game: Game) => {
			const includesNameQuery = game?.title
				.toLowerCase()
				.includes(queryGame.toLowerCase());
			const includesTierFilter = visibleTiers.find(
				(tier: TierId) => tier === game.tier,
			);
			if (includesNameQuery && includesTierFilter)
				return <GameTile key={`id-game-${game.id}`} gameId={game.id} />;
			else return null;
		})
		.filter(Boolean);

	return (
		<StyledGamesList>
			{filteredGames?.length === 0 ? 'No results.' : filteredGames}
		</StyledGamesList>
	);
};

const GameTileViewSkeleton = () => (
	<StyledGamesList>
		{new Array(12).fill(null).map(() => (
			<GameTile.Skeleton />
		))}
	</StyledGamesList>
);

const StyledGamesList = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	flex-wrap: wrap;
	gap: 32px;
`;
