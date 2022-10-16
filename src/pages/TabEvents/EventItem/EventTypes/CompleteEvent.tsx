import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { EventComplete } from '@masochistme/sdk/dist/v1/types';

import { useTiers, useUsers } from 'shared/hooks';
import logo from 'shared/images/logo.png';
import {
	EventDescription,
	EventSummary,
	EventInfo,
	EventImg,
	EventLink,
} from './components';

type Props = {
	event: EventComplete;
};

export const CompleteEvent = (props: Props): JSX.Element | null => {
	const { event } = props;
	const history = useHistory();
	const users = useUsers(false);
	const { tiersData } = useTiers();
	const game = useSelector((state: any) =>
		state.games.list.find((g: any) => Number(g.id) === Number(event.gameId)),
	);
	const user = users.find((u: any) => u.id === event.memberId);
	const gameRating = tiersData.find((r: any) =>
		game ? Number(r.id) === Number(game.rating) : null,
	);

	const onUserClick = () => user?.id && history.push(`/profile/${user.id}`);
	const onGameClick = () => game?.id && history.push(`/game/${game.id}`);

	return (
		<EventInfo>
			<EventImg src={user?.avatar ?? logo} alt="game-img" />
			<EventDescription>
				<EventLink className="bold" onClick={onUserClick}>
					{user?.name ??
						`User ${event.memberId} (no longer member of the group)`}
				</EventLink>{' '}
				completed{' '}
				<EventLink className="bold" onClick={onGameClick}>
					{game?.title ?? `game ${event.gameId} (no longer curated)`}
				</EventLink>
				!
			</EventDescription>
			<EventSummary>
				<i
					className={
						user ? 'fas fa-check-square' : 'fas fa-exclamation-triangle'
					}></i>
				<i className={gameRating?.icon ?? 'far fa-question-circle'}></i>
				<EventImg src={game?.img ?? logo} alt="game-img" />
			</EventSummary>
		</EventInfo>
	);
};
