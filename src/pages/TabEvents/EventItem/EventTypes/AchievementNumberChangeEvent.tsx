import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
	EventAchievementNumberChange,
	Tier,
} from '@masochistme/sdk/dist/v1/types';

import {
	EventDescription,
	EventSummary,
	EventInfo,
	EventImg,
	EventLink,
} from './components';
import logo from 'shared/images/logo.png';
import { useTiers } from 'shared/hooks';

type Props = {
	event: EventAchievementNumberChange;
};

export const AchievementNumberChangeEvent = (
	props: Props,
): JSX.Element | null => {
	const { event } = props;
	const history = useHistory();
	const { tiersData } = useTiers();
	const tier = tiersData.find((t: Tier) =>
		game ? Number(t.id) === Number(game.rating) : null,
	);
	const games = useSelector((state: any) => state.games.list);
	const game = games.find((g: any) => Number(g.id) === Number(event.gameId));

	const onGameClick = () => game?.id && history.push(`/game/${game.id}`);

	return game && tier ? (
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
				<i className={tier ? tier.icon : 'far fa-question-circle'}></i>
				<EventImg alt="game-img" src={game ? game.img : logo} />
			</EventSummary>
		</EventInfo>
	) : null;
};
