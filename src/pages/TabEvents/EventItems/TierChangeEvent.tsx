import React from 'react';
import { useHistory } from 'react-router-dom';
import {
	Game,
	Tier,
	EventGameTierChange,
} from '@masochistme/sdk/dist/v1/types';

import { useAllGames, useTiers } from 'sdk';
import { Size, getTierIcon } from 'utils';
import { GameThumbnail } from 'containers';

import { BaseEvent } from './_BaseEvent';

type Props = { event: EventGameTierChange };

export const TierChangeEvent = (props: Props): JSX.Element | null => {
	const { event } = props;
	const history = useHistory();

	const { tiersData } = useTiers();
	const { gamesData } = useAllGames();

	const game = gamesData.find((g: Game) => g.id === event.gameId);
	const gameRating = tiersData.find((tier: Tier) => tier.id === game?.tier);
	const isDemoted = Number(event.oldTier) > Number(event.newTier);

	const iconGameTier = gameRating ? gameRating.icon : 'far fa-question-circle';
	const iconTierChange = isDemoted
		? 'fas fa-caret-square-down'
		: 'fas fa-caret-square-up';

	const onGameClick = () => game?.id && history.push(`/game/${game.id}`);

	if (!game) return null;

	return (
		<BaseEvent>
			<BaseEvent.Logo />
			<BaseEvent.Description>
				<BaseEvent.Link onClick={onGameClick}>
					{game?.title ?? `Game ${event.gameId}`} has been
				</BaseEvent.Link>
				{isDemoted ? ' demoted ' : ' promoted '}
				from <i className={getTierIcon(event.oldTier, tiersData)} /> to
				<i className={getTierIcon(event.newTier, tiersData)} />!
			</BaseEvent.Description>
			<BaseEvent.Summary>
				<BaseEvent.Icons>
					<i className={iconTierChange} />
					<i className={iconGameTier} />
				</BaseEvent.Icons>
				<GameThumbnail game={game} size={Size.SMALL} onClick={onGameClick} />
			</BaseEvent.Summary>
		</BaseEvent>
	);
};
