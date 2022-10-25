import React from 'react';
import { Game } from '@masochistme/sdk/dist/v1/types';

import { useLeaderboardsGames } from 'sdk';
import { Flex, IconInfo, Skeleton, defaultSort } from 'components';
import { Size } from 'utils';

export const useGameColumnAvgPlaytime = () => {
	const { leaderboardsData, isLoading, isFetched } = useLeaderboardsGames();

	const getGameAvgPlaytime = (game: Game): number => {
		const avgPlaytime = leaderboardsData.find(
			l => l.gameId === game?.id,
		)?.avgPlaytime;
		const fixedAvgPlaytime =
			!avgPlaytime || Number.isNaN(avgPlaytime) ? 0 : Math.round(avgPlaytime);

		return fixedAvgPlaytime;
	};

	const columnAvgPlaytime = {
		title: () => (
			<Flex row align justify gap={4}>
				Avg playtime
				<IconInfo hoverText="Average time needed to complete 100% of the Steam achievements" />
			</Flex>
		),
		render: (game: Game) => (
			<Flex row align justify>
				{isLoading && <Skeleton size={Size.SMALL} />}
				{isFetched && getGameAvgPlaytime(game)}
			</Flex>
		),
		sorter: (a: Game, b: Game) =>
			defaultSort(getGameAvgPlaytime(a), getGameAvgPlaytime(b)),
	};

	return { columnAvgPlaytime };
};
