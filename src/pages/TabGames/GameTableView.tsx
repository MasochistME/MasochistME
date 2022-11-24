import React from 'react';
import { Game, TierId } from '@masochistme/sdk/dist/v1/types';

import { useCuratedGames } from 'sdk';
import { useAppContext } from 'context';
import { Flex, Spinner, Table } from 'components';
import { useTheme } from 'styles';

import { useGameTableCells } from './columns';

enum Columns {
	TIER = 'Tier',
	THUMBNAIL = '',
	TITLE = 'Title',
	// // Statistics columns
	POINTS = 'Points',
	ACHIEVEMENTS = 'Achievements',
	BADGES = 'Badges',
	COMPLETIONS = 'Completions (base game)',
	// columnCompletionsWithBadges,
	OWNERS = 'Owners',
	AVG_PLAYTIME = 'Avg playtime',
	LATEST_COMPLETION = 'Latest completion',
	SALE = 'Sale',
}

export const GameTableView = (): JSX.Element => {
	const { visibleTiers, queryGame } = useAppContext();
	const { cellTier, cellThumbnail, cellTitle, cellSale } = useGameTableCells();

	const { gamesData, isLoading, isFetched } = useCuratedGames();

	const games = gamesData.filter(
		(game: Game) =>
			game?.title.toLowerCase().includes(queryGame.toLowerCase()) &&
			visibleTiers.find((tier: TierId) => tier === game.tier),
	);

	const rows = games.map(game => ({
		[Columns.TIER]: { value: game.tier, cell: cellTier(game) },
		[Columns.THUMBNAIL]: { value: 0, cell: cellThumbnail(game) },
		[Columns.TITLE]: { value: game.title, cell: cellTitle(game) },
		[Columns.POINTS]: { value: '?' },
		[Columns.ACHIEVEMENTS]: { value: game.achievementsTotal },
		[Columns.BADGES]: { value: '?' },
		[Columns.COMPLETIONS]: { value: '?' },
		[Columns.OWNERS]: { value: '?' },
		[Columns.AVG_PLAYTIME]: { value: '?' },
		[Columns.LATEST_COMPLETION]: { value: '?' },
		[Columns.SALE]: { value: game?.sale ?? 0, cell: cellSale(game) },
	}));

	const columns = Object.keys(rows[0] ?? []);

	return (
		<Flex width="100%">
			{isLoading && <Spinner />}
			{isFetched && <Table rows={rows} columns={columns} />}
		</Flex>
	);
};
