import React from 'react';
import { useHistory } from 'react-router-dom';
import {
	Game,
	Tier,
	EventGameAdd,
	EventGameRemove,
} from '@masochistme/sdk/dist/v1/types';

import logo from 'shared/images/logo.ico';
import { useGames, useTiers } from 'sdk';
import {
	EventDescription,
	EventSummary,
	EventInfo,
	EventImg,
	EventLink,
} from './components';
import { getGameThumbnail } from 'utils';

type Props = {
	event: EventGameAdd | EventGameRemove;
	action: 'added' | 'removed';
};

export const GameEvent = (props: Props): JSX.Element | null => {
	const { event, action } = props;
	const history = useHistory();

	const { tiersData } = useTiers();
	const { gamesData: games } = useGames();

	const game = games.find((g: Game) => g.id === event.gameId);
	const gameRating = tiersData.find((tier: Tier) => tier.id === game?.tier);
	const gameImg = getGameThumbnail(game?.id);

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
						Game {event.gameId}
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
				<EventImg alt="game-img" src={gameImg} />
			</EventSummary>
		</EventInfo>
	);
};
