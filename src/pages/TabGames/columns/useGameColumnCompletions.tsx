import React from 'react';
import { Game } from '@masochistme/sdk/dist/v1/types';

import { useLeaderboardsGames } from 'sdk';
import { Size } from 'components';
import { Flex, Skeleton, defaultSort } from 'components';

export const useGameColumnCompletions = () => {
	const { leaderboardsData, isLoading, isFetched } = useLeaderboardsGames();

	const getGameCompletions = (game: Game) => {
		const gameCompletions = leaderboardsData.find(l => l.gameId === game?.id)
			?.completions?.base;
		return gameCompletions ?? 0;
	};

	const columnCompletions = {
		title: <Flex>Completions (base game)</Flex>,
		render: (game: Game) => (
			<Flex row align justify>
				{isLoading && <Skeleton size={Size.SMALL} />}
				{isFetched && getGameCompletions(game)}
			</Flex>
		),
		sorter: (a: Game, b: Game) =>
			defaultSort(getGameCompletions(a), getGameCompletions(b)),
	};

	return { columnCompletions };
};
