import React from 'react';
import { Game, TierId } from '@masochistme/sdk/dist/v1/types';

import { useCuratedGames, useLeaderboardsGames } from 'sdk';
import { useAppContext } from 'context';
import { Flex, Icon, Size, Spinner, Table, TableColumn } from 'components';

import {
	CellTier,
	CellTitle,
	CellTotalPoints,
	CellSale,
	CellBadges,
	CellCompletions,
	CellOwners,
	CellAvgPlaytime,
	CellLatestCompletion,
	getGameTotalPoints,
	getGameCompletions,
	getGameBadges,
	getGameOwners,
	getGameAvgPlaytime,
	getGameLatestCompletion,
} from './columns';

enum Columns {
	TIER = '',
	TITLE = 'Title',
	POINTS = 'Points',
	ACHIEVEMENTS = 'Achievements',
	BADGES = 'Badges',
	COMPLETIONS = 'Completions (base game)',
	OWNERS = 'Owners',
	AVG_PLAYTIME = 'Avg playtime',
	LATEST_COMPLETION = 'Latest completion',
	SALE = 'Sale',
}

export const GameTableView = (): JSX.Element => {
	const { visibleTiers, queryGame } = useAppContext();

	const { gamesData, isLoading, isFetched } = useCuratedGames();
	const { leaderboardsData } = useLeaderboardsGames();

	const games = gamesData.filter(
		(game: Game) =>
			game?.title.toLowerCase().includes(queryGame.toLowerCase()) &&
			visibleTiers.find((tier: TierId) => tier === game.tier),
	);

	const columns: TableColumn<Game>[] = [
		{
			key: Columns.TIER,
			title: Columns.TIER,
			value: (game: Game) => game.tier,
			render: (game: Game) => <CellTier game={game} />,
			style: { width: '30px' },
		},
		{
			key: Columns.TITLE,
			title: Columns.TITLE,
			value: (game: Game) => game.title,
			render: (game: Game) => <CellTitle game={game} />,
			style: { width: '35%' },
		},
		{
			key: Columns.POINTS,
			title: (
				<Flex row align justify gap={4}>
					Points
					<Icon
						size={Size.MICRO}
						icon="QuestionCircle"
						hoverText="Sum of base points and all the game badges (excluding negative ones)"
					/>
				</Flex>
			),
			value: (game: Game) => getGameTotalPoints(game, leaderboardsData),
			render: (game: Game) => <CellTotalPoints game={game} />,
		},
		{
			key: Columns.ACHIEVEMENTS,
			title: Columns.ACHIEVEMENTS,
			value: (game: Game) => game.achievementsTotal,
			render: (game: Game) => (
				<Flex row align justify>
					{game.achievementsTotal}
				</Flex>
			),
		},
		{
			key: Columns.BADGES,
			title: Columns.BADGES,
			value: (game: Game) => getGameBadges(game, leaderboardsData),
			render: (game: Game) => <CellBadges game={game} />,
		},
		{
			key: Columns.COMPLETIONS,
			title: Columns.COMPLETIONS,
			value: (game: Game) => getGameCompletions(game, leaderboardsData),
			render: (game: Game) => <CellCompletions game={game} />,
		},
		{
			key: Columns.OWNERS,
			title: Columns.OWNERS,
			value: (game: Game) => getGameOwners(game, leaderboardsData),
			render: (game: Game) => <CellOwners game={game} />,
		},
		{
			key: Columns.AVG_PLAYTIME,
			title: (
				<Flex row align justify gap={4}>
					Avg playtime
					<Icon
						size={Size.MICRO}
						icon="QuestionCircle"
						hoverText="Average time (in hours) needed to complete 100% of the Steam achievements"
					/>
				</Flex>
			),
			value: (game: Game) => getGameAvgPlaytime(game, leaderboardsData),
			render: (game: Game) => <CellAvgPlaytime game={game} />,
		},
		{
			key: Columns.LATEST_COMPLETION,
			title: Columns.LATEST_COMPLETION,
			value: (game: Game) => getGameLatestCompletion(game, leaderboardsData),
			render: (game: Game) => <CellLatestCompletion game={game} />,
		},
		{
			key: Columns.SALE,
			title: Columns.SALE,
			value: (game: Game) => game?.sale ?? 0,
			render: (game: Game) => <CellSale game={game} />,
		},
	];

	return (
		<Flex width="100%">
			{isLoading && <Spinner />}
			{isFetched && <Table columns={columns} dataset={games} />}
		</Flex>
	);
};
