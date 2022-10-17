import React from 'react';
import { orderBy } from 'lodash';
import { useSelector } from 'react-redux';

import { Badge } from '@masochistme/sdk/dist/v1/types';
import { useActiveTab, useBadges } from 'shared/hooks';
import { Wrapper, Flex } from 'components';
import { TabDict } from 'shared/config/tabs';

export const TabBadges = (): JSX.Element => {
	useActiveTab(TabDict.BADGES);

	const games = useSelector((state: any) => state.games.list);
	const { badgesData } = useBadges();
	const badges = orderBy(
		badgesData.map(
			(badge: Badge) =>
				(badge = {
					...badge,
					title: badge.isSteamGame
						? badge.title
						: games.find((game: any) => game.id === badge.gameId)?.title ??
						  'unknown',
				}),
		),
		['gameId'],
		['desc'],
	);

	return (
		<Flex column>
			<Wrapper type="description">
				<div className="page-description">
					<p>This is the list showcasing the last 100 events.</p>
					<p>There are six different types of events:</p>
				</div>
			</Wrapper>
			<Wrapper type="page">
				{badges.map((badge: Badge, index) => (
					<img
						className="profile-badge"
						src={badge.img}
						alt="badge"
						title={`${badge.title?.toUpperCase()} - ${badge.name} (${
							badge.points
						} pts)\n"${badge.description}"`}
						key={`badge-${index}`}
					/>
				))}
			</Wrapper>
		</Flex>
	);
};
