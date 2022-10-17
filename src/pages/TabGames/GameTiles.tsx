import React from 'react';
import { useSelector } from 'react-redux';
import { orderBy } from 'lodash';
import { TierId } from '@masochistme/sdk/dist/v1/types';

import { Spinner, Wrapper } from 'components';
import { useTiers } from 'shared/hooks';
import { GameTile } from './GameTile';
import { useAppContext } from 'shared/store/context';

export const GameTiles = (): JSX.Element => {
	const { tiersData } = useTiers();
	const { visibleTiers, queryGame } = useAppContext();

	const games = useSelector((state: any) => {
		const filteredGames = state.games.list.filter(
			(game: any) => game.curated || game.protected,
		);
		return orderBy(
			filteredGames,
			['rating', game => game.title.toLowerCase()],
			['desc', 'asc'],
		);
	});

	return (
		<Wrapper type="page">
			{games && games.length ? (
				games.map((game: any) => {
					return game?.title.toLowerCase().indexOf(queryGame.toLowerCase()) !==
						-1 &&
						visibleTiers.find(
							(tier: TierId) => Number(tier) === Number(game.rating),
						) ? (
						<GameTile
							key={`id-game-${game.id}`}
							id={game.id}
							rating={tiersData}
						/>
					) : null;
				})
			) : (
				<Spinner />
			)}
		</Wrapper>
	);
};