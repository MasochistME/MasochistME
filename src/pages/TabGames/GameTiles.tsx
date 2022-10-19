import React from 'react';
import { Game, TierId } from '@masochistme/sdk/dist/v1/types';

import { Spinner } from 'components';
import { useCuratedGames } from 'sdk';
import { GameTile } from './GameTile';
import { useAppContext } from 'shared/store/context';

export const GameTiles = (): JSX.Element => {
	const { visibleTiers, queryGame } = useAppContext();

	const { gamesData: games, isFetched } = useCuratedGames();

	return (
		<div>
			{isFetched ? (
				(games ?? []).map((game: Game) => {
					return game?.title.toLowerCase().indexOf(queryGame.toLowerCase()) !==
						-1 && visibleTiers.find((tier: TierId) => tier === game.tier) ? (
						<GameTile key={`id-game-${game.id}`} gameId={game.id} />
					) : null;
				})
			) : (
				<Spinner />
			)}
		</div>
	);
};
