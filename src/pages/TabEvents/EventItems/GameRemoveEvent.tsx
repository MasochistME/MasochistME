import React from 'react';
import { useHistory } from 'react-router-dom';
import { Game, Tier, EventGameRemove } from '@masochistme/sdk/dist/v1/types';

import { useAllGames, useTiers } from 'sdk';
import { GameThumbnail } from 'containers';
import { Size } from 'utils';

import { BaseEvent } from './_BaseEvent';

type Props = {
	event: EventGameRemove;
};

export const GameRemoveEvent = (props: Props): JSX.Element | null => {
	const { event } = props;
	const history = useHistory();

	const { tiersData } = useTiers();
	const { gamesData: games } = useAllGames();

	const game = games.find((g: Game) => g.id === event.gameId);
	const gameRating = tiersData.find((tier: Tier) => tier.id === game?.tier);

	const iconGameAdd = game
		? 'fas fa-minus-square'
		: 'fas fa-exclamation-triangle';
	const iconGameRating = gameRating
		? gameRating.icon
		: 'far fa-question-circle';

	const onGameClick = () => {
		if (game?.id) history.push(`/game/${game.id}`);
	};

	return (
		<BaseEvent>
			<BaseEvent.Logo />
			<BaseEvent.Description>
				<BaseEvent.Link onClick={onGameClick}>
					{game ? game.title : `Game ${event.gameId}`}
				</BaseEvent.Link>
				has been removed from curator!
			</BaseEvent.Description>
			<BaseEvent.Summary>
				<BaseEvent.Icons>
					<i className={iconGameAdd} />
					<i className={iconGameRating} />
				</BaseEvent.Icons>
				<GameThumbnail game={game} size={Size.SMALL} onClick={onGameClick} />
			</BaseEvent.Summary>
		</BaseEvent>
	);
};
