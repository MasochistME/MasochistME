import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
	EventBadgeCreate,
	EventBadgeGet,
	Badge,
	Member,
} from '@masochistme/sdk/dist/v1/types';

import { useBadges, useMembers } from 'shared/hooks';
import logo from 'shared/images/logo.png';
import {
	EventDescription,
	EventSummary,
	EventInfo,
	EventImg,
	EventLink,
} from './components';

type Props = {
	event: EventBadgeCreate | EventBadgeGet;
	action: 'added' | 'given';
};

export const BadgeEvent = (props: Props): JSX.Element | null => {
	const { event, action } = props;
	if (action === 'added') {
		return <BadgeAdded event={event as EventBadgeCreate} />;
	}
	if (action === 'given') {
		return <BadgeGiven event={event as EventBadgeGet} />;
	}
	return null;
};

/**
 * Component displaying info about badge creation event.
 */
const BadgeAdded = ({ event }: { event: EventBadgeCreate }) => {
	const history = useHistory();
	const { data: badges } = useBadges();

	const badge = badges.find((b: Badge) => String(b._id) === event.badgeId);
	const game = useSelector((state: any) =>
		state.games.list.find((g: any) => Number(g.id) === Number(event.gameId)),
	);

	const onGameClick = () => game?.id && history.push(`/game/${game.id}`);

	return (
		<EventInfo>
			<EventImg src={badge ? badge.img : logo} alt="game-img" />
			{badge && game ? (
				<EventDescription>
					<EventLink className="bold" onClick={onGameClick}>
						{game?.title ? game.title : `Game ${event.gameId}`}
					</EventLink>{' '}
					has gotten a new badge -{' '}
					<span className="bold">
						{badge?.name ? badge.name : event.badgeId}
					</span>
					!
				</EventDescription>
			) : null}
			<EventSummary>
				<i className="fas fa-award"></i>
				<EventImg src={game ? game.img : logo} alt="game-img" />
			</EventSummary>
		</EventInfo>
	);
};

/**
 * Component displaying info about badge granted event.
 */
const BadgeGiven = ({ event }: { event: EventBadgeGet }) => {
	const history = useHistory();

	const { membersData } = useMembers();
	const { data: badges } = useBadges();

	const badge = badges.find((b: Badge) => String(b._id) === event.badgeId);
	const member = membersData.find((m: Member) => m.steamId === event.memberId);

	const onUserClick = () => {
		if (member?.steamId) history.push(`/profile/${member.steamId}`);
	};

	return (
		<EventInfo>
			<EventImg src={member?.avatar ?? logo} alt="game-img" />
			{badge && member ? (
				<EventDescription>
					<EventLink className="bold" onClick={onUserClick}>
						{member?.name ?? `User ${event.memberId}`}
					</EventLink>{' '}
					has earned a new badge -{' '}
					<span className="bold">{badge?.name ?? event.badgeId}</span>!
				</EventDescription>
			) : null}
			<EventSummary>
				<i
					className={
						member ? 'fas fa-check-square' : 'fas fa-exclamation-triangle'
					}></i>
				<i className="fas fa-medal"></i>
				<EventImg src={badge ? badge.img : logo} alt="game-img" />
			</EventSummary>
		</EventInfo>
	);
};
