import React from 'react';
import { orderBy } from 'lodash';
import { Badge, Game } from '@masochistme/sdk/dist/v1/types';

import { useActiveTab } from 'shared/hooks';
import { useBadges, useCuratedGames } from 'sdk';
import { TabDict } from 'shared/config/tabs';
import { Wrapper, Flex, Tooltip } from 'components';

export const TabBadges = (): JSX.Element => {
	useActiveTab(TabDict.BADGES);

	const { gamesData: games } = useCuratedGames();
	const { badgesData } = useBadges();

	const badges = orderBy(
		badgesData.map((badge: Badge) => {
			const gameTitle = badge.isSteamGame
				? games.find((game: Game) => game.id === badge.gameId)?.title ??
				  'unknown'
				: badge.title;
			return {
				...badge,
				gameTitle,
			};
		}),
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
				{badges.map(badge => (
					<Tooltip
						content={`${badge.gameTitle?.toUpperCase()} - ${badge.name} (${
							badge.points
						} pts)\n"${badge.description}"`}>
						<img
							className="profile-badge"
							src={badge.img}
							alt="badge"
							key={`badge-${String(badge._id)}`}
						/>
					</Tooltip>
				))}
			</Wrapper>
		</Flex>
	);
};
