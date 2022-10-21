import React, { useMemo } from 'react';
import { Game, TierId } from '@masochistme/sdk/dist/v1/types';

import { useCuratedGames, useTiers } from 'sdk';
import { useAppContext } from 'shared/store/context';
import { Flex, Spinner } from 'components';
import { GameTile } from 'containers';

export const GameTileView = (): JSX.Element => {
	const { visibleTiers, queryGame } = useAppContext();

	const {
		gamesData = [],
		isLoading: isGamesLoading,
		isFetched: isGamesFetched,
	} = useCuratedGames();
	const { isLoading: isTiersLoading, isFetched: isTiersFetched } = useTiers();

	const filteredGames = useMemo(() => {
		return gamesData
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
	}, [gamesData, visibleTiers, queryGame]);

	const isFetched = isGamesFetched && isTiersFetched;
	const isLoading = isGamesLoading && isTiersLoading;

	return (
		<Flex gap={16} align justify flexWrap="wrap">
			{isLoading && <Spinner />}
			{isFetched && filteredGames}
			{filteredGames?.length === 0 && 'No results.'}
		</Flex>
	);
};
