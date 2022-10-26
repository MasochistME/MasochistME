import React from 'react';
import { Game, TierId } from '@masochistme/sdk/dist/v1/types';

import { useCuratedGames, useTiers } from 'sdk';
import { useAppContext } from 'context';
import { Flex, Loader } from 'components';
import { GameTile } from 'containers';

export const GameTileView = (): JSX.Element => {
	const { visibleTiers, queryGame } = useAppContext();

	const {
		gamesData = [],
		isLoading: isGamesLoading,
		isFetched: isGamesFetched,
	} = useCuratedGames();
	const { isLoading: isTiersLoading, isFetched: isTiersFetched } = useTiers();

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

	const isFetched = isGamesFetched && isTiersFetched;
	const isLoading = isGamesLoading && isTiersLoading;

	return (
		<Flex gap={32} align justify flexWrap="wrap">
			{isLoading && <Loader />}
			{isFetched && filteredGames}
			{isFetched && filteredGames?.length === 0 && 'No results.'}
		</Flex>
	);
};
