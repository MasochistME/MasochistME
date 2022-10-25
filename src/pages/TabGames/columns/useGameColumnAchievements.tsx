import React from 'react';
import { Game } from '@masochistme/sdk/dist/v1/types';

import { Flex, defaultSort } from 'components';

export const useGamesColumnAchievements = () => {
	const columnAchievements = {
		title: <Flex>Achievements</Flex>,
		render: (game: Game) => (
			<Flex row align justify>
				{game.achievementsTotal}
			</Flex>
		),
		sorter: (a: Game, b: Game) =>
			defaultSort(a.achievementsTotal, b.achievementsTotal),
	};

	return { columnAchievements };
};
