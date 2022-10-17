import React from 'react';
import { Game, TierId } from '@masochistme/sdk/dist/v1/types';

import { Spinner, Wrapper } from 'components';
import { useGames } from 'sdk';
import { GameTile } from './GameTile';
import { useAppContext } from 'shared/store/context';

export const GameTiles = (): JSX.Element => {
	const { visibleTiers, queryGame } = useAppContext();

	const { gamesData: games, isFetched } = useGames();

	return (
		<Wrapper type="page">
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
		</Wrapper>
	);
};
