import React from 'react';
import { Game } from '@masochistme/sdk/dist/v1/types';

import { useLeaderboardsGames } from 'sdk';
import { Size } from 'components';
import { Flex, Skeleton, defaultSort } from 'components';

export const useGameColumnCompletionsWithBadges = () => {
	const { leaderboardsData, isLoading, isFetched } = useLeaderboardsGames();

	const getGameCompletions = (game: Game) => {
		const gameCompletions = leaderboardsData.find(
			l => l.gameId === game?.id,
		)?.completions;
		const baseCompletion = gameCompletions?.base;
		const badgeCompletion = gameCompletions?.badges;
		// return gameCompletions ?? 0;
		return 0;
	};

	const columnCompletionsWithBadges = {
		title: <Flex>Completions (100% badges)</Flex>,
		render: (game: Game) => (
			<Flex row align justify>
				{isLoading && <Skeleton size={Size.SMALL} />}
				{isFetched && getGameCompletions(game)}
			</Flex>
		),
		sorter: (a: Game, b: Game) =>
			defaultSort(getGameCompletions(a), getGameCompletions(b)),
	};

	return { columnCompletionsWithBadges };
};
