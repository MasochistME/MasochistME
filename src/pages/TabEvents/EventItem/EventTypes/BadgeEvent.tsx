import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
	EventBadgeCreate,
	EventBadgeGet,
} from '@masochistme/sdk/dist/v1/types';

import {
	EventDescription,
	EventSummary,
	EventInfo,
	EventImg,
	EventLink,
} from 'pages/TabEvents/styles';
import { useBadges, useUsers } from 'shared/hooks';
import logo from 'shared/images/logo.png';
import { Badge } from '@masochistme/sdk/dist/v1/types';

type Props = {
	event: EventBadgeCreate | EventBadgeGet;
	action: 'added' | 'given';
};

export default function BadgeEvent(props: Props): JSX.Element | null {
	const { event, action } = props;
	if (action === 'added') {
		return <BadgeAdded event={event} />;
	}
	if (action === 'given') {
		return <BadgeGiven event={event} />;
	}
	return null;
}

// ----------------------------------------------
// ----------------------------------------------
// ----------------------------------------------

function BadgeAdded({ event }: { event: any }) {
	const history = useHistory();
	const { data: badges } = useBadges();
	const badge = badges.find((b: Badge) => b['_id'] === event.badge);
	const game = useSelector((state: any) =>
		state.games.list.find((g: any) => Number(g.id) === Number(event.game)),
	);

	const onGameClick = () => game?.id && history.push(`/game/${game.id}`);

	return (
		<EventInfo>
			<EventImg src={badge ? badge.img : logo} alt="game-img" />
			{badge && game ? (
				<EventDescription>
					<EventLink className="bold" onClick={onGameClick}>
						{game?.title ? game.title : `Game ${event.game}`}
					</EventLink>{' '}
					has gotten a new badge -{' '}
					<span className="bold">{badge?.name ? badge.name : event.badge}</span>
					!
				</EventDescription>
			) : null}
			<EventSummary>
				<i className="fas fa-award"></i>
				<EventImg src={game ? game.img : logo} alt="game-img" />
			</EventSummary>
		</EventInfo>
	);
}

// ----------------------------------------------
// ----------------------------------------------
// ----------------------------------------------

function BadgeGiven({ event }: { event: any }) {
	const history = useHistory();
	const users = useUsers(false);
	const { data: badges } = useBadges();
	const badge = badges.find((b: any) => b['_id'] === event.badge);

	const user = users.find((u: any) => u.id === event.member);

	const onUserClick = () => user?.id && history.push(`/profile/${user.id}`);

	return (
		<EventInfo>
			<EventImg src={user?.avatar ?? logo} alt="game-img" />
			{badge && user ? (
				<EventDescription>
					<EventLink className="bold" onClick={onUserClick}>
						{user?.name ?? `User ${event.member}`}
					</EventLink>{' '}
					has earned a new badge -{' '}
					<span className="bold">{badge?.name ?? event.badge}</span>!
				</EventDescription>
			) : null}
			<EventSummary>
				<i
					className={
						user ? 'fas fa-check-square' : 'fas fa-exclamation-triangle'
					}></i>
				<i className="fas fa-medal"></i>
				<EventImg src={badge ? badge.img : logo} alt="game-img" />
			</EventSummary>
		</EventInfo>
	);
}
