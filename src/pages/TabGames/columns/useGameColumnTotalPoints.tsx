import React from 'react';
import { Game, Tier } from '@masochistme/sdk/dist/v1/types';

import { useLeaderboardsGames, useTiers } from 'sdk';
import { Flex, Icon, Skeleton, defaultSort, Size } from 'components';

export const useGamesColumnTotalPoints = () => {
	const { leaderboardsData, isLoading, isFetched } = useLeaderboardsGames();
	const { tiersData } = useTiers();

	const getGamePoints = (game: Game) => {
		const ptsBadges =
			leaderboardsData.find(l => l.gameId === game?.id)?.badges?.points ?? 0;
		const ptsTiers =
			tiersData.find((tier: Tier) => tier.id === game.tier)?.score ?? 0;
		return ptsBadges + ptsTiers;
	};

	const columnTotalPoints = {
		title: () => (
			<Flex row align justify gap={4}>
				Points
				<Icon
					size={Size.MICRO}
					icon="QuestionCircle"
					hoverText="Sum of base points and all the game badges (excluding negative ones)"
				/>
			</Flex>
		),
		render: (game: Game) => {
			return (
				<Flex row align justify>
					{isLoading && <Skeleton size={Size.SMALL} />}
					{isFetched && getGamePoints(game)}
				</Flex>
			);
		},
		sorter: (a: Game, b: Game) =>
			defaultSort(getGamePoints(a), getGamePoints(b)),
	};

	return { columnTotalPoints };
};
