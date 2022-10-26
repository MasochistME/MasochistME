import React from 'react';
import { Game } from '@masochistme/sdk/dist/v1/types';

import { useLeaderboardsGames } from 'sdk';
import { Size } from 'components';
import { Flex, Skeleton, defaultSort } from 'components';

export const useGameColumnBadges = () => {
	const { leaderboardsData, isLoading, isFetched } = useLeaderboardsGames();

	const getBadgeNumber = (game: Game) => {
		const gameBadgeNumber = leaderboardsData.find(l => l.gameId === game?.id)
			?.badges?.total;
		return gameBadgeNumber ?? 0;
	};

	const columnBadges = {
		title: <Flex>Badges</Flex>,
		render: (game: Game) => (
			<Flex row align justify>
				{isLoading && <Skeleton size={Size.SMALL} />}
				{isFetched && getBadgeNumber(game)}
			</Flex>
		),
		sorter: (a: Game, b: Game) =>
			defaultSort(getBadgeNumber(a), getBadgeNumber(b)),
	};
	return { columnBadges };
};
