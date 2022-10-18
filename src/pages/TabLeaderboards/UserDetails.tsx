import React from 'react';
import { orderBy } from 'lodash';
import { Game, Member, Tier } from '@masochistme/sdk/dist/v1/types';

import { useTiers, useCuratorMembers, useCuratedGames } from 'sdk';
import { getGameThumbnail } from 'utils/getGameUrl';
import { Spinner } from 'components';

import { Display } from './components';
import { UserGame } from './UserGame';

type Props = {
	steamId: any;
	isVisible: any;
};

export const UserDetails = (props: Props): JSX.Element => {
	const { steamId, isVisible } = props;

	const { membersData, isFetched } = useCuratorMembers();
	const { gamesData } = useCuratedGames();
	const { tiersData } = useTiers();

	const member = {
		...membersData.find((m: Member) => m.steamId === steamId),
		games: [],
	};

	const composeGameList = () => {
		const userGames = orderBy(
			member.games.map((game: any) => ({
				...game,
				percentage: typeof game.percentage !== 'number' ? 0 : game.percentage,
			})),
			['percentage', 'lastUnlocked'],
			['desc', 'desc'],
		);

		return userGames.map(memberGame => {
			const game = gamesData.find((g: Game) => g.id === memberGame.id);
			if (!game) {
				// most likely non-steam game, or deleted one
				return;
			}
			const ratingIcon = tiersData.find((tier: Tier) => tier.id === game.tier);
			return (
				<UserGame
					key={`game-${memberGame.id}`}
					member={member}
					game={{
						...memberGame,
						title: game.title,
						rating: ratingIcon ? ratingIcon.icon : 'fas fa-spinner',
						img: getGameThumbnail(game.id),
					}}
				/>
			);
		});
	};

	if (isFetched)
		return <Display isVisible={isVisible}>{composeGameList()}</Display>;
	return <Spinner />;
};
