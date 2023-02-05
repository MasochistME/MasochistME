import React from 'react';
import { useHistory } from 'react-router';
import {
	Game,
	Tier,
	EventGameTierChange,
} from '@masochistme/sdk/dist/v1/types';

import { useAllGames, useTiers } from 'sdk';
import { getTierIcon } from 'utils';
import { GameThumbnail } from 'containers';
import { Size, Icon, IconType } from 'components';

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

	const onGameClick = () => game?.id && history.push(`/game/${game.id}`);

	if (!game) return null;

	return (
		<BaseEvent>
			<BaseEvent.Logo />
			<BaseEvent.Description>
				<BaseEvent.Link onClick={onGameClick}>
					{game?.title ?? `Game ${event.gameId}`}
				</BaseEvent.Link>
				<span>
					has been
					{isDemoted ? ' demoted ' : ' promoted '}
					from
				</span>
				<BaseEvent.Icon icon={getTierIcon(event.oldTier, tiersData)} />
				<span>to</span>
				<BaseEvent.Icon icon={getTierIcon(event.newTier, tiersData)} />
				<span>!</span>
			</BaseEvent.Description>
			<BaseEvent.Summary>
				<BaseEvent.Icons>
					<Icon icon={isDemoted ? 'AnglesDown' : 'AnglesUp'} />
					<Icon
						icon={gameRating ? (gameRating.icon as IconType) : 'QuestionCircle'}
					/>
				</BaseEvent.Icons>
				<GameThumbnail game={game} size={Size.SMALL} onClick={onGameClick} />
			</BaseEvent.Summary>
		</BaseEvent>
	);
};
