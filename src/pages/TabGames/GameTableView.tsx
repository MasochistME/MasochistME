import React from 'react';
import { Game, TierId } from '@masochistme/sdk/dist/v1/types';

import { useCuratedGames, useLeaderboardsGames } from 'sdk';
import { useAppContext } from 'context';
import { Flex, Spinner, Table } from 'components';

import {
	CellTier,
	CellThumbnail,
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
	TIER = 'Tier',
	THUMBNAIL = '',
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

	const rows = games.map(game => ({
		[Columns.TIER]: { value: game.tier, cell: <CellTier game={game} /> },
		[Columns.THUMBNAIL]: { value: 0, cell: <CellThumbnail game={game} /> },
		[Columns.TITLE]: { value: game.title, cell: <CellTitle game={game} /> },
		[Columns.POINTS]: {
			value: getGameTotalPoints(game, leaderboardsData),
			cell: <CellTotalPoints game={game} />,
		},
		[Columns.ACHIEVEMENTS]: {
			value: game.achievementsTotal,
			cell: (
				<Flex row align justify>
					{game.achievementsTotal}
				</Flex>
			),
		},
		[Columns.BADGES]: {
			value: getGameBadges(game, leaderboardsData),
			cell: <CellBadges game={game} />,
		},
		[Columns.COMPLETIONS]: {
			value: getGameCompletions(game, leaderboardsData),
			cell: <CellCompletions game={game} />,
		},
		[Columns.OWNERS]: {
			value: getGameOwners(game, leaderboardsData),
			cell: <CellOwners game={game} />,
		},
		[Columns.AVG_PLAYTIME]: {
			value: getGameAvgPlaytime(game, leaderboardsData),
			cell: <CellAvgPlaytime game={game} />,
		},
		[Columns.LATEST_COMPLETION]: {
			value: getGameLatestCompletion(game, leaderboardsData),
			cell: <CellLatestCompletion game={game} />,
		},
		[Columns.SALE]: { value: game?.sale ?? 0, cell: <CellSale game={game} /> },
	}));

	const columns = Object.keys(rows[0] ?? []);

	return (
		<Flex width="100%">
			{isLoading && <Spinner />}
			{isFetched && <Table rows={rows} columns={columns} bigColumn={3} />}
		</Flex>
	);
};

// // Points column title
{
	/* <Flex row align justify gap={4}>
Points
<Icon
	size={Size.MICRO}
	icon="QuestionCircle"
	hoverText="Sum of base points and all the game badges (excluding negative ones)"
/>
</Flex> */
}

// // Avg Playtime title

{
	/* <Flex row align justify gap={4}>
				Avg playtime
				<Icon
					size={Size.MICRO}
					icon="QuestionCircle"
					hoverText="Average time (in hours) needed to complete 100% of the Steam achievements"
				/>
			</Flex> */
}
