import React from 'react';
import { useHistory } from 'react-router';
import {
	EventComplete,
	Game,
	Member,
	Tier,
} from '@masochistme/sdk/dist/v1/types';

import { useTiers, useAllMembers, useAllGames } from 'sdk';
import { MemberAvatar, GameThumbnail } from 'containers';
import { Icon, IconType } from 'components';
import { Size } from 'components';

import { BaseEvent } from './_BaseEvent';

type Props = {
	event: EventComplete;
};

export const GameCompleteEvent = (props: Props): JSX.Element | null => {
	const { event } = props;
	const history = useHistory();

	const { membersData } = useAllMembers();
	const { tiersData } = useTiers();
	const { gamesData } = useAllGames();

	const member = membersData.find((m: Member) => m.steamId === event.memberId);
	const game = gamesData.find((g: Game) => g.id === event.gameId);
	const gameRating = tiersData.find((tier: Tier) => tier.id === game?.tier);

	const iconMemberComplete = member ? 'SquareCheck' : 'WarningTriangle';
	const iconGameRating = (gameRating?.icon ?? 'QuestionCircle') as IconType;

	const onMemberClick = () => {
		if (member?.steamId) history.push(`/profile/${member.steamId}`);
	};
	const onGameClick = () => {
		if (game?.id) history.push(`/game/${game.id}`);
	};

	return (
		<BaseEvent>
			<MemberAvatar member={member} size={Size.SMALL} onClick={onMemberClick} />
			<BaseEvent.Description>
				<BaseEvent.Link onClick={onMemberClick}>
					{member?.name ?? `User ${event.memberId}`}
				</BaseEvent.Link>
				<span>completed</span>
				<BaseEvent.Link onClick={onGameClick}>
					{game?.title ?? `game ${event.gameId}`}!
				</BaseEvent.Link>
			</BaseEvent.Description>
			<BaseEvent.Summary>
				<BaseEvent.Icons>
					<Icon icon={iconMemberComplete} />
					<Icon icon={iconGameRating} />
				</BaseEvent.Icons>
				<GameThumbnail game={game} size={Size.SMALL} onClick={onGameClick} />
			</BaseEvent.Summary>
		</BaseEvent>
	);
};
