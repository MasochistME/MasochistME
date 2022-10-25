import React from 'react';
import { Game } from '@masochistme/sdk/dist/v1/types';

import { useLeaderboardsGames } from 'sdk';
import { Size } from 'utils';
import { Flex, IconInfo, Skeleton, defaultSort } from 'components';

export const useGameColumnLatestCompletion = () => {
	const { leaderboardsData, isLoading, isFetched } = useLeaderboardsGames();

	const getLatestGameCompletion = (game: Game) => {
		const gameLatestCompletion = leaderboardsData.find(
			l => l.gameId === game?.id,
		)?.times?.newestCompletion;
		return new Date(gameLatestCompletion ?? 0).getTime();
	};

	const columnLatestCompletion = {
		title: () => (
			<Flex row align justify gap={4}>
				Oldest completion
				<IconInfo hoverText="Last time when the game got completed by a curator member" />
			</Flex>
		),
		render: (game: Game) => (
			<Flex row align justify>
				{isLoading && <Skeleton size={Size.SMALL} />}
				{isFetched && new Date(getLatestGameCompletion(game))}
			</Flex>
		),
		sorter: (a: Game, b: Game) =>
			defaultSort(getLatestGameCompletion(a), getLatestGameCompletion(b)),
	};

	return { columnLatestCompletion };
};
