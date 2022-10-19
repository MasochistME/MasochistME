import React from 'react';
import { useHistory } from 'react-router-dom';
import {
	EventBadgeCreate,
	EventBadgeGet,
	Badge,
	Member,
	Game,
} from '@masochistme/sdk/dist/v1/types';

import { getGameThumbnail, Size } from 'utils';
import { MemberAvatar } from 'containers';
import { useBadges, useCuratedGames, useAllMembers } from 'sdk';
import logo from 'shared/images/logo.ico';
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

	const { gamesData } = useCuratedGames();
	const { badgesData } = useBadges();

	const badge = badgesData.find((b: Badge) => String(b._id) === event.badgeId);
	const game = gamesData.find((g: Game) => g.id === event.gameId);
	const gameImg = getGameThumbnail(game?.id);

	const onGameClick = () => {
		if (game?.id) history.push(`/game/${game.id}`);
	};

	return (
		<EventInfo>
			<EventImg src={badge ? badge.img : logo} alt="game-img" />
			{badge && game ? (
				<EventDescription>
					<EventLink className="bold" onClick={onGameClick}>
						{game?.title ?? `Game ${event.gameId}`}
					</EventLink>{' '}
					has gotten a new badge -{' '}
					<span className="bold">{badge?.name ?? event.badgeId}</span>!
				</EventDescription>
			) : null}
			<EventSummary>
				<i className="fas fa-award"></i>
				<EventImg src={gameImg} alt="game-img" />
			</EventSummary>
		</EventInfo>
	);
};

/**
 * Component displaying info about badge granted event.
 */
const BadgeGiven = ({ event }: { event: EventBadgeGet }) => {
	const history = useHistory();

	const { membersData } = useAllMembers();
	const { badgesData } = useBadges();

	const badge = badgesData.find((b: Badge) => String(b._id) === event.badgeId);
	const member = membersData.find((m: Member) => m.steamId === event.memberId);

	const onUserClick = () => {
		if (member?.steamId) history.push(`/profile/${member.steamId}`);
	};

	return (
		<EventInfo>
			<MemberAvatar member={member} size={Size.SMALL} />
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
