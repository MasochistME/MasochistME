import React from 'react';
import { useSelector } from 'react-redux';
import { orderBy } from 'lodash';

import { Spinner, Wrapper } from 'shared/components';
import Game from './Game';
import { useTiers } from 'shared/hooks';

export default function ViewGamesTiles(): JSX.Element {
	const { tiersData } = useTiers();
	const searchGame = useSelector((state: any) => state.search.game);
	const showGamesRated = useSelector((state: any) => state.showGamesRated);
	const inView = useSelector((state: any) => state.games.view === 'tiles');
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
		<Wrapper type="page" style={{ display: inView ? 'flex' : 'none' }}>
			{games && games.length ? (
				games.map((game: any) => {
					return game?.title.toLowerCase().indexOf(searchGame.toLowerCase()) !==
						-1 &&
						showGamesRated.find(
							(score: any) => parseInt(score, 10) === parseInt(game.rating, 10),
						) ? (
						<Game key={`id-game-${game.id}`} id={game.id} rating={tiersData} />
					) : null;
				})
			) : (
				<Spinner />
			)}
		</Wrapper>
	);
}
