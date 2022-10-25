import React from 'react';
import { useHistory } from 'react-router-dom';
import { Game } from '@masochistme/sdk/dist/v1/types';

import { useTiers } from 'sdk';
import { getTierIcon, Size } from 'utils';
import { TableLink, defaultSort } from 'components';
import { GameThumbnail } from 'containers';

import { useGamesColumnTotalPoints } from './useGameColumnTotalPoints';
import { useGamesColumnAchievements } from './useGameColumnAchievements';
import { useGameColumnBadges } from './useGameColumnBadges';
import { useGameColumnCompletions } from './useGameColumnCompletions';
// import { useGameColumnCompletionsWithBadges } from './useGameColumnCompletionsWithBadges';
import { useGameColumnOwners } from './useGameColumnOwners';
import { useGameColumnAvgPlaytime } from './useGameColumnAvgPlaytime';
import { useGameColumnLatestCompletion } from './useGameColumnLatestCompletion';

export const useGamesColumns = () => {
	const history = useHistory();
	const { tiersData } = useTiers();
	const { columnTotalPoints } = useGamesColumnTotalPoints();
	const { columnAchievements } = useGamesColumnAchievements();
	const { columnBadges } = useGameColumnBadges();
	const { columnCompletions } = useGameColumnCompletions();
	// const { columnCompletionsWithBadges } = useGameColumnCompletionsWithBadges();
	const { columnOwners } = useGameColumnOwners();
	const { columnAvgPlaytime } = useGameColumnAvgPlaytime();
	const { columnLatestCompletion } = useGameColumnLatestCompletion();

	const onGameClick = (game: Game) => {
		if (game?.id) history.push(`/game/${game.id}`);
	};

	const columnTier = {
		render: (game: Game) => <i className={getTierIcon(game.tier, tiersData)} />,
		sorter: (a: Game, b: Game) => defaultSort(a.tier, b.tier),
	};

	const columnThumbnail = {
		render: (game: Game) => <GameThumbnail game={game} size={Size.MEDIUM} />,
	};

	const columnTitle = {
		title: 'Title',
		width: '30%',
		render: (game: Game) => (
			<TableLink onClick={() => onGameClick(game)}>{game.title}</TableLink>
		),
		sorter: (a: Game, b: Game) => defaultSort(a.title, b.title),
	};

	const columnSale = {
		title: 'Sale',
		render: (game: Game) => {
			const sale = game.sale ? `${game.sale}%` : '—';
			return <div>{sale}</div>;
		},
		sorter: (a: Game, b: Game) => defaultSort(a.sale ?? 0, b.sale ?? 0),
	};

	return [
		// // Basic columns
		columnTier,
		columnThumbnail,
		columnTitle,
		// // Statistics columns
		columnTotalPoints,
		columnAchievements,
		columnBadges,
		columnCompletions,
		// columnCompletionsWithBadges,
		columnOwners,
		columnAvgPlaytime,
		columnLatestCompletion,
		columnSale,
	];
};
