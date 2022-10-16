import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { EventGameTierChange } from '@masochistme/sdk/dist/v1/types';

import { getTierIcon } from 'shared/helpers';
import {
	EventDescription,
	EventSummary,
	EventInfo,
	EventImg,
	EventLink,
} from 'pages/TabEvents/styles';
import logo from 'shared/images/logo.png';
import { useTiers } from 'shared/hooks';

type Props = { event: EventGameTierChange };

export default function TierChangeEvent(props: Props): JSX.Element | null {
	const { event } = props;
	const history = useHistory();
	const { tiersData } = useTiers();
	const games = useSelector((state: any) => state.games.list);

	const game = games.find(
		(g: any) => Number(g.id) === Number(props.event.gameId),
	);
	const gameRating = tiersData.find((r: any) =>
		game ? Number(r.id) === Number(game.rating) : null,
	);
	const demoted = Number(props.event.oldTier) > Number(props.event.newTier);

	const onGameClick = () => game?.id && history.push(`/game/${game.id}`);

	return game && gameRating ? (
		<EventInfo>
			<EventImg alt="game-img" src={logo} />
			<EventDescription>
				<EventLink className="bold" onClick={onGameClick}>
					{game ? game.title : '-'}
				</EventLink>
				{demoted ? ' demoted ' : ' promoted '}
				from <i className={getTierIcon(event.oldTier, tiersData)}></i> to{' '}
				<i className={getTierIcon(event.newTier, tiersData)}></i>!
			</EventDescription>
			<EventSummary>
				{demoted ? (
					<i
						className={
							game ? 'fas fa-caret-square-down' : 'fas fa-exclamation-triangle'
						}></i>
				) : (
					<i
						className={
							game ? 'fas fa-caret-square-up' : 'fas fa-exclamation-triangle'
						}></i>
				)}
				<i
					className={
						gameRating ? gameRating.icon : 'far fa-question-circle'
					}></i>
				<EventImg alt="game-img" src={game ? game.img : logo} />
			</EventSummary>
		</EventInfo>
	) : null;
}
