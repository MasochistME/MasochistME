import React from 'react';
import { useSelector } from 'react-redux';
import { orderBy } from 'lodash';

import { useTiers, useUserDetails, useMembers } from 'shared/hooks';
import { Spinner } from 'components';
import { Display, DetailsSummary, RatingScore } from './styles';
import { UserGame } from './UserGame';
import { Member, Tier } from '@masochistme/sdk/dist/v1/types';

type TUserDetails = {
	id: any;
	show: any;
};

UserDetails.Display = Display;
UserDetails.DetailsSummary = DetailsSummary;
UserDetails.RatingScore = RatingScore;

export default function UserDetails(props: TUserDetails): JSX.Element {
	const { id, show } = props;

	const userLoaded = useUserDetails(id);
	const { membersData } = useMembers();
	const { tiersData } = useTiers();

	const games = useSelector((state: any) => state.games.list);
	const member = useSelector((state: any) => {
		const memberBasic = membersData.find((m: Member) => m.steamId === id);
		const memberGames =
			state.users.details.find((user: any) => user.id === id)?.games ?? [];
		const userRanking = state.ranking.find((user: any) => user.id === id);
		return {
			...memberBasic,
			games: memberGames,
			ranking: userRanking,
		};
	});

	const composeGameList = () => {
		const userGames = orderBy(
			member.games.map((game: any) => ({
				...game,
				percentage: typeof game.percentage !== 'number' ? 0 : game.percentage,
			})),
			['percentage', 'lastUnlocked'],
			['desc', 'desc'],
		);

		return userGames.map(game => {
			const gameDetails = games.find(
				(g: any) => Number(g.id) === Number(game.id),
			);
			if (!gameDetails) {
				// most likely non-steam game, or deleted one
				return;
			}
			const ratingIcon = tiersData.find(
				(tier: Tier) => tier.id === gameDetails.rating,
			);
			return (
				<UserGame
					key={`game-${game.id}`}
					user={member}
					game={{
						...game,
						badges: gameDetails.badges,
						title: gameDetails.title,
						rating: ratingIcon ? ratingIcon.icon : 'fas fa-spinner',
						img: gameDetails.img,
					}}
				/>
			);
		});
	};

	return userLoaded ? (
		<UserDetails.Display show={show}>{composeGameList()}</UserDetails.Display>
	) : (
		<Spinner />
	);
}
