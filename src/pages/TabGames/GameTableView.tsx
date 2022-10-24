import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Game, TierId } from '@masochistme/sdk/dist/v1/types';

import { useCuratedGames, useTiers } from 'sdk';
import { useAppContext } from 'context';
import { getTierIcon, Size } from 'utils';
import {
	Flex,
	Spinner,
	Table,
	TableLink,
	Tooltip,
	defaultSort,
} from 'components';
import { GameThumbnail } from 'containers';

import {
	CellTotalPoints,
	CellCompletions,
	CellAvgPlaytime,
	CellBadges,
	CellAchievements,
} from './GameTableViewCells';

export const GameTableView = (): JSX.Element => {
	const history = useHistory();
	const { visibleTiers, queryGame } = useAppContext();

	const {
		tiersData,
		isLoading: isTiersLoading,
		isFetched: isTiersFetched,
	} = useTiers();
	const {
		gamesData,
		isLoading: isGamesLoading,
		isFetched: isGamesFetched,
	} = useCuratedGames();

	const isLoading = isTiersLoading && isGamesLoading;
	const isFetched = isTiersFetched && isGamesFetched;

	const games = gamesData.filter(
		(game: Game) =>
			game?.title.toLowerCase().includes(queryGame.toLowerCase()) &&
			visibleTiers.find((tier: TierId) => tier === game.tier),
	);
	const onGameClick = (game: Game) => {
		if (game?.id) history.push(`/game/${game.id}`);
	};

	const columnTier = {
		render: (game: Game) => {
			const icon = getTierIcon(game.tier, tiersData);
			return (
				<Flex margin="0 8px 0 12px">
					<i className={icon} />
				</Flex>
			);
		},
		sorter: (a: Game, b: Game) => {
			return defaultSort(a.tier, b.tier);
		},
	};

	const columnThumbnail = {
		render: (game: Game) => {
			return <GameThumbnail game={game} size={Size.BIG} />;
		},
	};

	const columnTitle = {
		title: 'Title',
		width: '30%',
		render: (game: Game) => {
			return (
				<TableLink onClick={() => onGameClick(game)}>{game.title}</TableLink>
			);
		},
		sorter: (a: Game, b: Game) => {
			return defaultSort(a.title, b.title);
		},
	};

	const columnPoints = {
		title: () => {
			return (
				<Tooltip content="Sum of base points and all the game badges (excluding negative ones)">
					<Flex row align justify>
						Points{' '}
						<i
							className="fas fa-question-circle"
							style={{ fontSize: '12px', marginLeft: '6px' }}></i>
					</Flex>
				</Tooltip>
			);
		},
		render: (game: Game) => {
			return <CellTotalPoints game={game} />;
		},
		// sorter: (a: Game, b: Game) => {
		// 	const points = (game: Game) => {
		// 		const tierPoints =
		// 			tiersData.find((tier: Tier) => tier.id === game.tier)?.score ?? 0;
		// 		return game?.badgesPts + tierPoints;
		// 	};
		// 	return defaultSort(points(a), points(b));
		// },
	};

	const columnCompletions = {
		title: 'Completions',
		render: (game: Game) => <CellCompletions game={game} />,
		// sorter: (a: Game, b: Game) => defaultSort(a?.completions, b?.completions),
	};

	const columnAvgPlaytime = {
		title: () => (
			<Tooltip content="Average time needed to complete 100% of the Steam achievements">
				<Flex row align justify>
					Avg playtime{' '}
					<i
						className="fas fa-question-circle"
						style={{ fontSize: '12px', marginLeft: '6px' }}></i>
				</Flex>
			</Tooltip>
		),
		render: (game: Game) => <CellAvgPlaytime game={game} />,
		// sorter: (a: Game, b: Game) => defaultSort(a?.avgPlaytime, b?.avgPlaytime),
	};

	const columnBadges = {
		title: 'Badges',
		render: (game: Game) => <CellBadges game={game} />,
		// sorter: (a: Game, b: Game) => defaultSort(a?.badgesNr, b?.badgesNr),
	};

	const columnAchievements = {
		title: 'Achievements',
		render: (game: Game) => <CellAchievements game={game} />,
		// sorter: (a: Game, b: Game) => defaultSort(a?.achievementsNr, b?.achievementsNr),
	};

	const columnSale = {
		title: 'Sale',
		render: (game: Game) => {
			const sale = game.sale ? `${game.sale}%` : '—';
			return <div>{sale}</div>;
		},
		sorter: (a: Game, b: Game) => defaultSort(a.sale ?? 0, b.sale ?? 0),
	};

	const gamesColumns = [
		columnTier,
		columnThumbnail,
		columnTitle,
		columnPoints,
		columnCompletions,
		columnAvgPlaytime,
		columnBadges,
		columnAchievements,
		columnSale,
	];

	return (
		<Flex width="100%">
			{isLoading && <Spinner />}
			{isFetched && (
				<Table
					dataSource={games}
					columns={gamesColumns}
					showSorterTooltip={false}
					pagination={{
						pageSize: 20,
						defaultPageSize: 20,
						hideOnSinglePage: true,
						showQuickJumper: false,
						showLessItems: true,
						showSizeChanger: false,
					}}
				/>
			)}
		</Flex>
	);
};
