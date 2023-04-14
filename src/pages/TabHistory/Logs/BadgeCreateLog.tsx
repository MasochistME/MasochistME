import React from 'react';
import { useNavigate } from 'react-router';
import { LogBadgeCreate, Badge, Game } from '@masochistme/sdk/dist/v1/types';

import { Icon } from 'components';
import { BadgeThumbnail, GameThumbnail } from 'containers';
import { useBadges, useCuratedGames } from 'sdk';
import { Size } from 'components';

import { HistoryLog } from '.';

export const BadgeCreateLog = ({ log }: { log: LogBadgeCreate }) => {
	const navigate = useNavigate();

	const { gamesData } = useCuratedGames();
	const { badgesData } = useBadges();

	const badge = badgesData.find((b: Badge) => String(b._id) === log.badgeId);
	const game = gamesData.find((g: Game) => g.id === log.gameId);

	const onGameClick = () => {
		if (game?.id) navigate(`/game/${game.id}`);
	};

	if (!badge || !game) return null;
	return (
		<HistoryLog>
			<BadgeThumbnail size={Size.SMALL} badge={badge} />
			<HistoryLog.Description>
				<HistoryLog.Link onClick={onGameClick}>
					{game?.title ?? `Game ${log.gameId}`}
				</HistoryLog.Link>
				has gotten a new badge -
				<HistoryLog.Link onClick={onGameClick}>
					{' '}
					{badge?.name ?? log.badgeId}!
				</HistoryLog.Link>
			</HistoryLog.Description>
			<HistoryLog.Summary>
				<HistoryLog.Icons>
					<Icon icon="Badge" />
				</HistoryLog.Icons>
				<GameThumbnail game={game} size={Size.SMALL} onClick={onGameClick} />
			</HistoryLog.Summary>
		</HistoryLog>
	);
};
