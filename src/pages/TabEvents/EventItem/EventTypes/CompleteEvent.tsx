import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { EventComplete, Member, Tier } from '@masochistme/sdk/dist/v1/types';

import { useTiers, useMembers } from 'shared/hooks';
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

	const { membersData } = useMembers();
	const { tiersData } = useTiers();
	const member = membersData.find((m: Member) => m.steamId === event.memberId);
	const game = useSelector((state: any) =>
		state.games.list.find((g: any) => Number(g.id) === Number(event.gameId)),
	);

	const gameRating = tiersData.find((tier: Tier) =>
		game ? Number(tier.id) === Number(game.rating) : null,
	);

	const onUserClick = () => {
		if (member?.steamId) history.push(`/profile/${member.steamId}`);
	};
	const onGameClick = () => {
		if (game?.id) history.push(`/game/${game.id}`);
	};

	return (
		<EventInfo>
			<EventImg src={member?.avatar ?? logo} alt="game-img" />
			<EventDescription>
				<EventLink className="bold" onClick={onUserClick}>
					{member?.name ??
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
						member ? 'fas fa-check-square' : 'fas fa-exclamation-triangle'
					}></i>
				<i className={gameRating?.icon ?? 'far fa-question-circle'}></i>
				<EventImg src={game?.img ?? logo} alt="game-img" />
			</EventSummary>
		</EventInfo>
	);
};