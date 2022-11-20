import React from 'react';
import { Game, TierId } from '@masochistme/sdk/dist/v1/types';

import { useCuratedGames } from 'sdk';
import { useAppContext } from 'context';
import { Flex, Spinner, Table } from 'components';
import { useTheme } from 'styles';

import { useGameTableCells } from './columns';

export const GameTableView = (): JSX.Element => {
	const { visibleTiers, queryGame } = useAppContext();
	const { colorTokens } = useTheme();
	const { cellTier, cellThumbnail, cellTitle, cellSale } = useGameTableCells();

	const { gamesData, isLoading, isFetched } = useCuratedGames();

	const games = gamesData.filter(
		(game: Game) =>
			game?.title.toLowerCase().includes(queryGame.toLowerCase()) &&
			visibleTiers.find((tier: TierId) => tier === game.tier),
	);

	const gamesColumns = [
		'Tier',
		'',
		'Title',
		// // Statistics columns
		'Points',
		'Achievements',
		'Badges',
		'Completions (base game)',
		// columnCompletionsWithBadges,
		'Owners',
		'Avg playtime',
		'Latest completion',
		'Sale',
	];

	const rows = games.map((game: Game) => ({
		name: game.title,
		cells: [
			cellTier(game),
			cellThumbnail(game),
			cellTitle(game),
			'?',
			game.achievementsTotal,
			'?',
			'?',
			'?',
			'?',
			'?',
			cellSale(game),
		],
	}));

	return (
		<Flex width="100%">
			{isLoading && <Spinner />}
			{isFetched && (
				<Table rows={rows} columns={gamesColumns} />
				// <TableAnt
				// 	colorTokens={colorTokens}
				// 	dataSource={games}
				// 	columns={gamesColumns}
				// 	showSorterTooltip={false}
				// 	pagination={{
				// 		pageSize: 20,
				// 		defaultPageSize: 20,
				// 		hideOnSinglePage: true,
				// 		showQuickJumper: false,
				// 		showLessItems: true,
				// 		showSizeChanger: false,
				// 	}}
				// />
			)}
		</Flex>
	);
};
