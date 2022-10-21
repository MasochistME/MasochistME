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
import { BadgeThumbnail, MemberAvatar } from 'containers';
import { useBadges, useCuratedGames, useAllMembers } from 'sdk';

import { BaseEvent } from './BaseEvent';

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
		<BaseEvent>
			<BadgeThumbnail size={Size.SMALL} badge={badge} />
			{badge && game ? (
				<BaseEvent.Description>
					<BaseEvent.Link className="bold" onClick={onGameClick}>
						{game?.title ?? `Game ${event.gameId}`}
					</BaseEvent.Link>{' '}
					has gotten a new badge -{' '}
					<span className="bold">{badge?.name ?? event.badgeId}</span>!
				</BaseEvent.Description>
			) : null}
			<BaseEvent.Summary>
				<BaseEvent.Icons>
					<i className="fas fa-award"></i>
				</BaseEvent.Icons>
				<BaseEvent.Image src={gameImg} alt="game-img" />
			</BaseEvent.Summary>
		</BaseEvent>
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
		<BaseEvent>
			<MemberAvatar member={member} size={Size.SMALL} />
			{badge && member ? (
				<BaseEvent.Description>
					<BaseEvent.Link className="bold" onClick={onUserClick}>
						{member?.name ?? `User ${event.memberId}`}
					</BaseEvent.Link>{' '}
					has earned a new badge -{' '}
					<span className="bold">{badge?.name ?? event.badgeId}</span>!
				</BaseEvent.Description>
			) : null}
			<BaseEvent.Summary>
				<BaseEvent.Icons>
					<i
						className={
							member ? 'fas fa-check-square' : 'fas fa-exclamation-triangle'
						}></i>
					<i className="fas fa-medal"></i>
				</BaseEvent.Icons>
				<BadgeThumbnail badge={badge} size={Size.SMALL} />
			</BaseEvent.Summary>
		</BaseEvent>
	);
};
