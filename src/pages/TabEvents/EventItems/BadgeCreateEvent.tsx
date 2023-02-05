import React from 'react';
import { useHistory } from 'react-router';
import { EventBadgeCreate, Badge, Game } from '@masochistme/sdk/dist/v1/types';

import { Icon } from 'components';
import { BadgeThumbnail, GameThumbnail } from 'containers';
import { useBadges, useCuratedGames } from 'sdk';
import { Size } from 'components';

import { BaseEvent } from './_BaseEvent';

export const BadgeCreateEvent = ({ event }: { event: EventBadgeCreate }) => {
	const history = useHistory();

	const { gamesData } = useCuratedGames();
	const { badgesData } = useBadges();

	const badge = badgesData.find((b: Badge) => String(b._id) === event.badgeId);
	const game = gamesData.find((g: Game) => g.id === event.gameId);

	const onGameClick = () => {
		if (game?.id) history.push(`/game/${game.id}`);
	};

	if (!badge || !game) return null;
	return (
		<BaseEvent>
			<BadgeThumbnail size={Size.SMALL} badge={badge} />
			<BaseEvent.Description>
				<BaseEvent.Link onClick={onGameClick}>
					{game?.title ?? `Game ${event.gameId}`}
				</BaseEvent.Link>
				has gotten a new badge -
				<BaseEvent.Link onClick={onGameClick}>
					{' '}
					{badge?.name ?? event.badgeId}!
				</BaseEvent.Link>
			</BaseEvent.Description>
			<BaseEvent.Summary>
				<BaseEvent.Icons>
					<Icon icon="Badge" />
				</BaseEvent.Icons>
				<GameThumbnail game={game} size={Size.SMALL} onClick={onGameClick} />
			</BaseEvent.Summary>
		</BaseEvent>
	);
};
