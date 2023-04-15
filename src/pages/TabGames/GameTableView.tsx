import React from 'react';
import { Game, TierId } from '@masochistme/sdk/dist/v1/types';

import { useCuratedGames, useLeaderboardsGames, useTiers } from 'sdk';
import { useAppContext } from 'context';
import {
	Flex,
	Icon,
	Size,
	Table,
	TableColumn,
	QueryBoundary,
	ErrorFallback,
} from 'components';

import {
	Cell,
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
	PRICE = 'Full price',
	SALE = 'Sale',
}

export const GameTableView = () => {
	const columns = Object.values(Columns).map(c => ({
		key: c,
		title: c,
		value: () => '',
		render: () => null,
	}));
	return (
		<QueryBoundary
			fallback={
				<Table.Skeleton columns={columns} style={{ margin: '0.6rem 0' }} />
			}
			errorFallback={<ErrorFallback />}>
			<GameTableViewBoundary />
		</QueryBoundary>
	);
};

const GameTableViewBoundary = () => {
	const { visibleTiers, visiblePrices, queryGame } = useAppContext();
	const { gamesData } = useCuratedGames();
	const { leaderboardsData } = useLeaderboardsGames();
	const { tiersData } = useTiers();

	const games = gamesData.filter((game: Game) => {
		const includesNameQuery = game?.title
			.toLowerCase()
			.includes(queryGame.toLowerCase());
		const includesTierFilter = visibleTiers.find(
			(tier: TierId) => tier === game.tier,
		);
		const isInPriceRange =
			game.price !== null &&
			game.price / 100 >= visiblePrices[0] &&
			game.price / 100 <= visiblePrices[1];
		return includesNameQuery && includesTierFilter && isInPriceRange;
	});

	const columns: TableColumn<Game>[] = [
		{
			key: Columns.TIER,
			title: Columns.TIER,
			value: (game: Game) => game.tier,
			render: (game: Game) => <Cell.Tier game={game} />,
			style: { width: '3rem' },
		},
		{
			key: Columns.TITLE,
			title: Columns.TITLE,
			value: (game: Game) => game.title,
			render: (game: Game) => <Cell.Title game={game} />,
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
			value: (game: Game) =>
				getGameTotalPoints(game, leaderboardsData, tiersData),
			render: (game: Game) => <Cell.TotalPoints game={game} />,
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
			render: (game: Game) => <Cell.Badges game={game} />,
		},
		{
			key: Columns.COMPLETIONS,
			title: Columns.COMPLETIONS,
			value: (game: Game) => getGameCompletions(game, leaderboardsData),
			render: (game: Game) => <Cell.Completions game={game} />,
		},
		{
			key: Columns.OWNERS,
			title: Columns.OWNERS,
			value: (game: Game) => getGameOwners(game, leaderboardsData),
			render: (game: Game) => <Cell.Owners game={game} />,
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
			render: (game: Game) => <Cell.AvgPlaytime game={game} />,
		},
		{
			key: Columns.LATEST_COMPLETION,
			title: Columns.LATEST_COMPLETION,
			value: (game: Game) => {
				const { latestGameCompletion } = getGameLatestCompletion(
					game,
					leaderboardsData,
				);
				return latestGameCompletion;
			},
			render: (game: Game) => <Cell.LatestCompletion game={game} />,
		},
		{
			key: Columns.PRICE,
			title: (
				<Flex row align justify gap={4}>
					{Columns.PRICE}
					<Icon
						size={Size.MICRO}
						icon="QuestionCircle"
						hoverText="Full price in EUR (€) not counting any discounts"
					/>
				</Flex>
			),
			value: (game: Game) => game?.price ?? 0,
			render: (game: Game) => <Cell.Price game={game} />,
		},
		{
			key: Columns.SALE,
			title: Columns.SALE,
			value: (game: Game) => game?.sale ?? 0,
			render: (game: Game) => <Cell.Sale game={game} />,
		},
	];

	return (
		<Flex width="100%">
			<Table columns={columns} dataset={games} />
		</Flex>
	);
};
