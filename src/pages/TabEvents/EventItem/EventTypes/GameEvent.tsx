import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { EventGameAdd, EventGameRemove } from '@masochistme/sdk/dist/v1/types';

import logo from 'shared/images/logo.png';
import { useTiers } from 'shared/hooks';
import {
	EventDescription,
	EventSummary,
	EventInfo,
	EventImg,
	EventLink,
} from './components';

type Props = {
	event: EventGameAdd | EventGameRemove;
	action: 'added' | 'removed';
};

export const GameEvent = (props: Props): JSX.Element | null => {
	const { event, action } = props;
	const history = useHistory();
	const { tiersData } = useTiers();
	const games = useSelector((state: any) => state.games.list);

	const game = games.find((g: any) => Number(g.id) === Number(event.gameId));
	const gameRating = tiersData.find((r: any) =>
		game ? Number(r.id) === Number(game.rating) : null,
	);

	const onGameClick = () =>
		action === 'added' && game?.id && history.push(`/game/${game.id}`);

	return (
		<EventInfo>
			<EventImg alt="game-img" src={logo} />
			{game ? (
				<EventDescription>
					<EventLink className="bold" onClick={onGameClick}>
						{game ? game.title : `Game ${event.gameId}`}
					</EventLink>{' '}
					{action === 'added'
						? 'has been curated!'
						: 'has been removed from curator!'}
				</EventDescription>
			) : (
				<EventDescription>
					<EventLink className="bold" onClick={onGameClick}>
						{game ? game.title : `Game ${event.gameId}`}
					</EventLink>{' '}
					(no longer curated) has been{' '}
					{action === 'added' ? 'curated!' : 'removed from curator!'}
				</EventDescription>
			)}

			<EventSummary>
				<i
					className={
						game
							? `fas fa-${action === 'added' ? 'plus' : 'minus'}-square`
							: 'fas fa-exclamation-triangle'
					}></i>
				<i
					className={
						gameRating ? gameRating.icon : 'far fa-question-circle'
					}></i>
				<EventImg alt="game-img" src={game ? game.img : logo} />
			</EventSummary>
		</EventInfo>
	);
};
