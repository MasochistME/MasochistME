import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { orderBy } from 'lodash';

import { Flex, Wrapper, Section, BigBadge } from 'components';
import { Badges } from './styles';
import ProfileGraphs from './ProfileGraphs';
import { useActiveTab, useBadges } from 'shared/hooks';
import { Badge } from '@masochistme/sdk/dist/v1/types';
import { TabDict } from 'shared/config/tabs';

FullProfile.Badges = Badges;
FullProfile.Badge = BigBadge;
FullProfile.Section = Section;

type Props = {
	user: any;
};
export default function FullProfile(props: Props): JSX.Element {
	useActiveTab(TabDict.PROFILE);

	const { user } = props;

	const history = useHistory();
	const { badgesData } = useBadges();

	const games = useSelector((state: any) => state.games.list);

	const getBadges = (): Badge[] => {
		const userBadges = badgesData
			.filter(
				(badge: any) =>
					user?.badges && user.badges.find((b: any) => b.id === badge._id),
			)
			.map(
				(badge: any) =>
					(badge = {
						...badge,
						points:
							typeof badge.points !== 'number'
								? Number(badge.points)
								: badge.points,
						game: badge.isNonSteamGame
							? badge.game
							: games.find((game: any) => game.id === badge.gameId)
							? games.find((game: any) => game.id === badge.gameId).title
							: 'unknown',
					}),
			);
		const orderedUserBadges = orderBy(
			userBadges,
			[badge => badge.points],
			['desc'],
		);
		return orderedUserBadges;
	};

	const badges = getBadges();

	const onBadgeClick = (id?: string) => id && history.push(`/game/${id}`);

	return (
		<Flex column>
			<Wrapper type="page">
				{badges?.length ? (
					<FullProfile.Badges>
						<FullProfile.Section style={{ width: '100%' }}>
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
										<FullProfile.Badge
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
											onClick={() => onBadgeClick(game?.id)}
										/>
									);
								})}
							</Flex>
						</FullProfile.Section>
					</FullProfile.Badges>
				) : null}
				{!isNaN(user?.points?.sum) && user?.points?.sum !== 0 ? (
					<ProfileGraphs user={user} />
				) : null}
			</Wrapper>
		</Flex>
	);
}