import React from 'react';
import { useHistory } from 'react-router-dom';
import {
	Game,
	Tier,
	EventGameTierChange,
} from '@masochistme/sdk/dist/v1/types';

import logo from 'shared/images/logo.png';
import { useGames, useTiers } from 'shared/hooks';
import { getGameThumbnail, getTierIcon } from 'utils';
import {
	EventDescription,
	EventSummary,
	EventInfo,
	EventImg,
	EventLink,
} from './components';

type Props = { event: EventGameTierChange };

export const TierChangeEvent = (props: Props): JSX.Element | null => {
	const { event } = props;
	const history = useHistory();

	const { tiersData } = useTiers();
	const { gamesData } = useGames();

	const game = gamesData.find((g: Game) => g.id === event.gameId);

	if (!game) return null;

	const gameRating = tiersData.find((tier: Tier) => tier.id === game?.tier);
	const gameImg = getGameThumbnail(game.id);
	const isDemoted = Number(event.oldTier) > Number(event.newTier);

	const onGameClick = () => game?.id && history.push(`/game/${game.id}`);

	return (
		<EventInfo>
			<EventImg alt="game-img" src={logo} />
			<EventDescription>
				<EventLink className="bold" onClick={onGameClick}>
					{game.title ?? '-'}
				</EventLink>
				{isDemoted ? ' demoted ' : ' promoted '}
				from <i className={getTierIcon(event.oldTier, tiersData)}></i> to{' '}
				<i className={getTierIcon(event.newTier, tiersData)}></i>!
			</EventDescription>
			<EventSummary>
				{isDemoted ? (
					<i className={'fas fa-caret-square-down'}></i>
				) : (
					<i className={'fas fa-caret-square-up'}></i>
				)}
				<i
					className={
						gameRating ? gameRating.icon : 'far fa-question-circle'
					}></i>
				<EventImg alt="game-img" src={gameImg} />
			</EventSummary>
		</EventInfo>
	);
};
