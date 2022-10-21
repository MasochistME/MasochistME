import React from 'react';
import { useHistory } from 'react-router-dom';
import {
	Game,
	Tier,
	EventGameTierChange,
} from '@masochistme/sdk/dist/v1/types';

import logo from 'shared/images/logo.ico';
import { useAllGames, useTiers } from 'sdk';
import { getGameThumbnail, getTierIcon } from 'utils';

import { BaseEvent } from './BaseEvent';

type Props = { event: EventGameTierChange };

export const TierChangeEvent = (props: Props): JSX.Element | null => {
	const { event } = props;
	const history = useHistory();

	const { tiersData } = useTiers();
	const { gamesData } = useAllGames();

	const game = gamesData.find((g: Game) => g.id === event.gameId);

	if (!game) return null;

	const gameRating = tiersData.find((tier: Tier) => tier.id === game?.tier);
	const gameImg = getGameThumbnail(game.id);
	const isDemoted = Number(event.oldTier) > Number(event.newTier);

	const onGameClick = () => game?.id && history.push(`/game/${game.id}`);

	return (
		<BaseEvent>
			<BaseEvent.Image alt="game-img" src={logo} />
			<BaseEvent.Description>
				<BaseEvent.Link className="bold" onClick={onGameClick}>
					{game.title ?? '-'}
				</BaseEvent.Link>
				{isDemoted ? ' demoted ' : ' promoted '}
				from <i className={getTierIcon(event.oldTier, tiersData)}></i> to{' '}
				<i className={getTierIcon(event.newTier, tiersData)}></i>!
			</BaseEvent.Description>
			<BaseEvent.Summary>
				<BaseEvent.Icons>
					{isDemoted ? (
						<i className="fas fa-caret-square-down" />
					) : (
						<i className="fas fa-caret-square-up" />
					)}
					<i
						className={gameRating ? gameRating.icon : 'far fa-question-circle'}
					/>
				</BaseEvent.Icons>
				<BaseEvent.Image alt="game-img" src={gameImg} />
			</BaseEvent.Summary>
		</BaseEvent>
	);
};
