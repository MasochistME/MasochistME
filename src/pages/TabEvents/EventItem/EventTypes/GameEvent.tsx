import React from 'react';
import { useHistory } from 'react-router-dom';
import {
	Game,
	Tier,
	EventGameAdd,
	EventGameRemove,
} from '@masochistme/sdk/dist/v1/types';

import logo from 'shared/images/logo.ico';
import { useAllGames, useTiers } from 'sdk';
import { getGameThumbnail } from 'utils';

import { BaseEvent } from './BaseEvent';

type Props = {
	event: EventGameAdd | EventGameRemove;
	action: 'added' | 'removed';
};

export const GameEvent = (props: Props): JSX.Element | null => {
	const { event, action } = props;
	const history = useHistory();

	const { tiersData } = useTiers();
	const { gamesData: games } = useAllGames();

	const game = games.find((g: Game) => g.id === event.gameId);
	const gameRating = tiersData.find((tier: Tier) => tier.id === game?.tier);
	const gameImg = getGameThumbnail(game?.id);

	const onGameClick = () =>
		action === 'added' && game?.id && history.push(`/game/${game.id}`);

	return (
		<BaseEvent>
			<BaseEvent.Image alt="game-img" src={logo} />
			{game ? (
				<BaseEvent.Description>
					<BaseEvent.Link className="bold" onClick={onGameClick}>
						{game ? game.title : `Game ${event.gameId}`}
					</BaseEvent.Link>{' '}
					{action === 'added'
						? 'has been curated!'
						: 'has been removed from curator!'}
				</BaseEvent.Description>
			) : (
				<BaseEvent.Description>
					<BaseEvent.Link className="bold" onClick={onGameClick}>
						Game {event.gameId}
					</BaseEvent.Link>{' '}
					(no longer curated) has been{' '}
					{action === 'added' ? 'curated!' : 'removed from curator!'}
				</BaseEvent.Description>
			)}
			<BaseEvent.Summary>
				<BaseEvent.Icons>
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
				</BaseEvent.Icons>
				<BaseEvent.Image alt="game-img" src={gameImg} />
			</BaseEvent.Summary>
		</BaseEvent>
	);
};
