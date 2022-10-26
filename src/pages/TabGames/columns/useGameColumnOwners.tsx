import React from 'react';
import { Game } from '@masochistme/sdk/dist/v1/types';

import { useLeaderboardsGames } from 'sdk';
import { Size } from 'components';
import { Flex, Skeleton, defaultSort } from 'components';

export const useGameColumnOwners = () => {
	const { leaderboardsData, isLoading, isFetched } = useLeaderboardsGames();

	const getGameOwners = (game: Game) => {
		const gameLeaderboards = leaderboardsData.find(l => l.gameId === game?.id);
		return gameLeaderboards?.owners ?? 0;
	};

	const columnOwners = {
		title: () => (
			<Flex row align justify gap={4}>
				Owners
			</Flex>
		),
		render: (game: Game) => (
			<Flex row align justify>
				{isLoading && <Skeleton size={Size.SMALL} />}
				{isFetched && getGameOwners(game)}
			</Flex>
		),
		sorter: (a: Game, b: Game) =>
			defaultSort(getGameOwners(a), getGameOwners(b)),
	};

	return { columnOwners };
};
