import React from 'react';
import { useHistory } from 'react-router-dom';
import {
	EventAchievementNumberChange,
	Tier,
	Game,
} from '@masochistme/sdk/dist/v1/types';

import logo from 'shared/images/logo.png';
import { getGameThumbnail } from 'utils';
import { useTiers, useGames } from 'shared/hooks';
import {
	EventDescription,
	EventSummary,
	EventInfo,
	EventImg,
	EventLink,
} from './components';

type Props = {
	event: EventAchievementNumberChange;
};

export const AchievementNumberChangeEvent = (
	props: Props,
): JSX.Element | null => {
	const { event } = props;
	const history = useHistory();

	const { tiersData } = useTiers();
	const { gamesData: games } = useGames();

	const game = games.find((g: Game) => g.id === event.gameId);
	const tier = tiersData.find((t: Tier) => t.id === game?.tier);
	const gameImg = getGameThumbnail(game?.id);

	const onGameClick = () => {
		if (game?.id) history.push(`/game/${game.id}`);
	};

	if (!game || !tier) return null;
	return (
		<EventInfo>
			<EventImg alt="game-img" src={logo} />
			<EventDescription>
				<EventLink className="bold" onClick={onGameClick}>
					{game ? game.title : '-'}{' '}
				</EventLink>
				{event.oldNumber < event.newNumber
					? `got ${event.newNumber - event.oldNumber} new achievements!`
					: `had ${event.oldNumber - event.newNumber} achievements removed!`}
			</EventDescription>
			<EventSummary>
				<i
					className={game ? 'fas fa-tasks' : 'fas fa-exclamation-triangle'}></i>
				<i className={tier?.icon ?? 'far fa-question-circle'}></i>
				<EventImg alt="game-img" src={gameImg} />
			</EventSummary>
		</EventInfo>
	);
};
