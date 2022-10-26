import React from 'react';
import { Game } from '@masochistme/sdk/dist/v1/types';

import { useLeaderboardsGames } from 'sdk';
import { Size } from 'components';
import { Flex, IconInfo, Skeleton, defaultSort } from 'components';

export const useGameColumnLatestCompletion = () => {
	const { leaderboardsData, isLoading, isFetched } = useLeaderboardsGames();

	const getLatestGameCompletion = (game: Game) => {
		const gameLatestCompletion = leaderboardsData.find(
			l => l.gameId === game?.id,
		)?.times?.newestCompletion;
		return new Date(gameLatestCompletion ?? 0).getTime();
	};

	const getLatestGameCompletionLocale = (game: Game) => {
		const date = getLatestGameCompletion(game);
		if (!date) return 'never';
		return new Date(date).toLocaleDateString();
	};

	const columnLatestCompletion = {
		title: () => (
			<Flex row align justify gap={4}>
				Latest completion
			</Flex>
		),
		render: (game: Game) => (
			<Flex row align justify>
				{isLoading && <Skeleton size={Size.SMALL} />}
				{isFetched && getLatestGameCompletionLocale(game)}
			</Flex>
		),
		sorter: (a: Game, b: Game) =>
			defaultSort(getLatestGameCompletion(a), getLatestGameCompletion(b)),
	};

	return { columnLatestCompletion };
};
