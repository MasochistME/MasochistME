import React from 'react';
import { useHistory } from 'react-router';
import { Game, Tier, EventGameAdd } from '@masochistme/sdk/dist/v1/types';

import { useAllGames, useTiers } from 'sdk';
import { GameThumbnail } from 'containers';
import { Icon, IconType } from 'components';
import { Size } from 'components';

import { BaseEvent } from './_BaseEvent';

type Props = {
	event: EventGameAdd;
};

export const GameAddEvent = (props: Props): JSX.Element | null => {
	const { event } = props;
	const history = useHistory();

	const { tiersData } = useTiers();
	const { gamesData: games } = useAllGames();

	const game = games.find((g: Game) => g.id === event.gameId);
	const gameRating = tiersData.find((tier: Tier) => tier.id === game?.tier);

	const iconGameAdd = game ? 'SquarePlus' : 'WarningTriangle';
	const iconGameRating = (
		gameRating ? gameRating.icon : 'QuestionCircle'
	) as IconType;

	const onGameClick = () => {
		history.push(`/game/${event.gameId}`);
	};

	return (
		<BaseEvent>
			<BaseEvent.Logo />
			<BaseEvent.Description>
				<BaseEvent.Link onClick={onGameClick}>
					{game ? game.title : `Game ${event.gameId}`}
				</BaseEvent.Link>
				<span>has been curated!</span>
			</BaseEvent.Description>
			<BaseEvent.Summary>
				<BaseEvent.Icons>
					<Icon icon={iconGameAdd} />
					<Icon icon={iconGameRating} />
				</BaseEvent.Icons>
				<GameThumbnail game={game} size={Size.SMALL} onClick={onGameClick} />
			</BaseEvent.Summary>
		</BaseEvent>
	);
};
