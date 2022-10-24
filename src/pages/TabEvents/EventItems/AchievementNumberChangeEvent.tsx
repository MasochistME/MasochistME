import React from 'react';
import { useHistory } from 'react-router-dom';
import {
	EventAchievementNumberChange,
	Tier,
	Game,
} from '@masochistme/sdk/dist/v1/types';

import { useTiers, useAllGames } from 'sdk';
import { GameThumbnail } from 'containers';

import { BaseEvent } from './_BaseEvent';
import { Size } from 'utils';

type Props = {
	event: EventAchievementNumberChange;
};

export const AchievementNumberChangeEvent = (
	props: Props,
): JSX.Element | null => {
	const { event } = props;
	const history = useHistory();

	const { tiersData } = useTiers();
	const { gamesData: games } = useAllGames();

	const game = games.find((g: Game) => g.id === event.gameId);
	const tier = tiersData.find((t: Tier) => t.id === game?.tier);

	const iconTier = tier?.icon ?? 'far fa-question-circle';
	const iconAchievementChange = game
		? 'fas fa-tasks'
		: 'fas fa-exclamation-triangle';

	const onGameClick = () => {
		if (game?.id) history.push(`/game/${game.id}`);
	};

	if (!game || !tier) return null;

	return (
		<BaseEvent>
			<BaseEvent.Logo />
			<BaseEvent.Description>
				<BaseEvent.Link onClick={onGameClick}>
					{game.title ?? `Game ${game.id}`}
				</BaseEvent.Link>
				{event.oldNumber < event.newNumber
					? `got ${event.newNumber - event.oldNumber} new achievements!`
					: `had ${event.oldNumber - event.newNumber} achievements removed!`}
			</BaseEvent.Description>
			<BaseEvent.Summary>
				<BaseEvent.Icons>
					<i className={iconAchievementChange} />
					<i className={iconTier} />
				</BaseEvent.Icons>
				<GameThumbnail game={game} size={Size.SMALL} onClick={onGameClick} />
			</BaseEvent.Summary>
		</BaseEvent>
	);
};
