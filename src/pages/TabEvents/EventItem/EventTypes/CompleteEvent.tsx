import React from 'react';
import { useHistory } from 'react-router-dom';
import {
	EventComplete,
	Game,
	Member,
	Tier,
} from '@masochistme/sdk/dist/v1/types';

import { getGameThumbnail, Size } from 'utils';
import { useTiers, useAllMembers, useAllGames } from 'sdk';
import { MemberAvatar } from 'containers';

import { BaseEvent } from './BaseEvent';

type Props = {
	event: EventComplete;
};

export const CompleteEvent = (props: Props): JSX.Element | null => {
	const { event } = props;
	const history = useHistory();

	const { membersData } = useAllMembers();
	const { tiersData } = useTiers();
	const { gamesData } = useAllGames();

	const member = membersData.find((m: Member) => m.steamId === event.memberId);
	const game = gamesData.find((g: Game) => g.id === event.gameId);
	const gameRating = tiersData.find((tier: Tier) => tier.id === game?.tier);
	const gameImg = getGameThumbnail(game?.id);

	const onUserClick = () => {
		if (member?.steamId) history.push(`/profile/${member.steamId}`);
	};
	const onGameClick = () => {
		if (game?.id) history.push(`/game/${game.id}`);
	};

	return (
		<BaseEvent>
			<MemberAvatar member={member} size={Size.SMALL} />
			<BaseEvent.Description>
				<BaseEvent.Link className="bold" onClick={onUserClick}>
					{member?.name ??
						`User ${event.memberId} (no longer member of the group)`}
				</BaseEvent.Link>{' '}
				completed{' '}
				<BaseEvent.Link className="bold" onClick={onGameClick}>
					{game?.title ?? `game ${event.gameId} (no longer curated)`}
				</BaseEvent.Link>
				!
			</BaseEvent.Description>
			<BaseEvent.Summary>
				<BaseEvent.Icons>
					<i
						className={
							member ? 'fas fa-check-square' : 'fas fa-exclamation-triangle'
						}></i>
					<i className={gameRating?.icon ?? 'far fa-question-circle'}></i>
				</BaseEvent.Icons>
				<BaseEvent.Image src={gameImg} alt="game-img" />
			</BaseEvent.Summary>
		</BaseEvent>
	);
};
