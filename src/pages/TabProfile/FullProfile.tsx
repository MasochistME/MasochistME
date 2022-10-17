import React from 'react';
import { useHistory } from 'react-router-dom';
import { orderBy } from 'lodash';
import { Badge, Game } from '@masochistme/sdk/dist/v1/types';

import { Flex, Wrapper, Section, BigBadge } from 'components';
import { useActiveTab } from 'shared/hooks';
import { useBadges, useGames } from 'sdk';
import { TabDict } from 'shared/config/tabs';

import { Badges } from './styles';
import { ProfileGraphs } from './ProfileGraphs';

type Props = {
	user: any;
};

export const FullProfile = (props: Props): JSX.Element => {
	const { user } = props;
	const history = useHistory();

	useActiveTab(TabDict.PROFILE);

	const { badgesData } = useBadges();
	const { gamesData: games } = useGames();

	const badges = getUserBadges(badgesData, games, user);

	const onBadgeClick = (gameId: number | null) => {
		if (gameId) history.push(`/game/${gameId}`);
	};

	return (
		<Flex column>
			<Wrapper type="page">
				{badges?.length ? (
					<Badges>
						<Section style={{ width: '100%' }}>
							<h3>Badges</h3>
							<Flex
								justify
								style={{
									width: '100%',
									display: 'flex',
									flexFlow: 'row wrap',
								}}>
								{badges.map((badge: Badge, index: number) => {
									const game = games.find(
										(g: any) => Number(g.id) === Number(badge.gameId),
									);
									return (
										<BigBadge
											src={badge.img}
											alt="badge"
											title={`${
												badge?.title && badge.title !== 'unknown'
													? badge?.title.toUpperCase()
													: game?.title.toUpperCase()
											} - ${badge.name} (${badge.points} pts)\n"${
												badge.description
											}"`}
											key={`badge-${index}`}
											onClick={() => onBadgeClick(badge.gameId)}
										/>
									);
								})}
							</Flex>
						</Section>
					</Badges>
				) : null}
				{!isNaN(user?.points?.sum) && user?.points?.sum !== 0 ? (
					<ProfileGraphs user={user} />
				) : null}
			</Wrapper>
		</Flex>
	);
};

const getUserBadges = (badges: Badge[], games: Game[], user: any): Badge[] => {
	const userBadges = badges
		.filter(
			(badge: Badge) =>
				user?.badges &&
				user.badges.find((b: any) => b.id === String(badge._id)),
		)
		.map((badge: Badge) => {
			const getGame = () => {
				if (badge.isSteamGame)
					return (
						games.find((game: Game) => game.id === badge.gameId)?.title ??
						'unknown'
					);
				else return badge.title;
			};
			const points = badge.points;
			return {
				...badge,
				points,
				game: getGame(),
			};
		});
	const orderedUserBadges = orderBy(
		userBadges,
		[badge => badge.points],
		['desc'],
	);
	return orderedUserBadges;
};
