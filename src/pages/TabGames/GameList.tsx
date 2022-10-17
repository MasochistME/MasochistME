import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { orderBy } from 'lodash';
import { getTierIcon } from 'shared/helpers';
import { Flex, Spinner, Wrapper, Table } from 'components';
import { TableLink, defaultSort } from 'components/layout/Table';
import { useTiers } from 'shared/hooks';
import { Tier, TierId } from '@masochistme/sdk/dist/v1/types';
import { useAppContext } from 'shared/store/context';

type GameData = {
	id: any;
	image: string;
	title: string;
	rating: string;
	completions: number;
	avgPlaytime: number;
	achievementsNr: number;
	badgesNr: number;
	badgesPts: number;
	sale: { onSale: boolean; discount: number };
};

export const GameList = (): JSX.Element => {
	const history = useHistory();
	const { visibleTiers, queryGame } = useAppContext();

	const { tiersData } = useTiers();

	const games = useSelector((state: any) => {
		const filteredGames = state.games.list.filter(
			(game: any) =>
				(game.curated || game.protected) &&
				game?.title.toLowerCase().includes(queryGame.toLowerCase()) &&
				visibleTiers.find(
					(tier: TierId) => Number(tier) === Number(game.rating),
				),
		);
		return orderBy(
			filteredGames,
			['rating', game => game.title.toLowerCase()],
			['desc', 'asc'],
		);
	});
	const onGameClick = (game: GameData) =>
		game?.id && history.push(`/game/${game.id}`);

	const gamesColumns = [
		{
			render: (game: GameData) => {
				const icon = getTierIcon(game.rating, tiersData);
				return (
					<Flex style={{ margin: '0 8px 0 12px' }}>
						<i className={icon} />
					</Flex>
				);
			},
			sorter: (a: GameData, b: GameData) => defaultSort(a.rating, b.rating),
		},
		{
			render: (game: GameData) => <GameImg src={game.image} />,
		},
		{
			title: 'Title',
			width: '30%',
			render: (game: GameData) => (
				<TableLink className="bold" onClick={() => onGameClick(game)}>
					{game.title}
				</TableLink>
			),
			sorter: (a: GameData, b: GameData) => defaultSort(a.title, b.title),
		},
		{
			title: () => (
				<Flex
					row
					align
					justify
					title="The total sum of base points and all the game badges (excluding negative ones)">
					Points{' '}
					<i
						className="fas fa-question-circle"
						style={{ fontSize: '12px', marginLeft: '6px' }}></i>
				</Flex>
			),
			render: (game: GameData) => {
				const tierPoints =
					tiersData.find((r: Tier) => r.id === game.rating)?.score ?? 0;
				const points = game.badgesPts + tierPoints;

				return <div>{points}</div>;
			},
			sorter: (a: GameData, b: GameData) => {
				const points = (game: GameData) => {
					const tierPoints =
						tiersData.find((r: Tier) => r.id === game.rating)?.score ?? 0;
					return game.badgesPts + tierPoints;
				};
				return defaultSort(points(a), points(b));
			},
		},
		{
			title: 'Completions',
			render: (game: GameData) => <div>{game.completions}</div>,
			sorter: (a: GameData, b: GameData) =>
				defaultSort(a.completions, b.completions),
		},
		{
			title: () => (
				<Flex
					row
					align
					justify
					title="Average time needed to complete 100% of the Steam achievements">
					Avg playtime{' '}
					<i
						className="fas fa-question-circle"
						style={{ fontSize: '12px', marginLeft: '6px' }}></i>
				</Flex>
			),
			render: (game: GameData) => <div>{`${game.avgPlaytime} h`}</div>,
			sorter: (a: GameData, b: GameData) =>
				defaultSort(a.avgPlaytime, b.avgPlaytime),
		},
		{
			title: 'Badges',
			render: (game: GameData) => <div>{game.badgesNr}</div>,
			sorter: (a: GameData, b: GameData) => defaultSort(a.badgesNr, b.badgesNr),
		},
		{
			title: 'Achievements',
			render: (game: GameData) => <div>{game.achievementsNr}</div>,
			sorter: (a: GameData, b: GameData) =>
				defaultSort(a.achievementsNr, b.achievementsNr),
		},
		{
			title: 'Sale',
			render: (game: GameData) => {
				const sale = game.sale.onSale ? `${game.sale.discount}%` : '—';
				return <div>{sale}</div>;
			},
			sorter: (a: GameData, b: GameData) =>
				defaultSort(a.sale.discount ?? 0, b.sale.discount ?? 0),
		},
	];

	const gamesData: GameData[] = games.map((game: any) => ({
		id: game.id,
		image: game.img,
		title: game.title,
		rating: game.rating,
		completions: game.stats.completions,
		avgPlaytime: Math.round(game.stats.avgPlaytime),
		achievementsNr: game.stats.achievementsNr,
		badgesNr: game.stats.badgesNr,
		badgesPts: game.stats.badgesPts,
		sale: game.sale,
	}));

	return (
		<Wrapper type="page">
			{games && games.length ? (
				<Table
					dataSource={gamesData}
					// @ts-ignore
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
			) : (
				<Spinner />
			)}
		</Wrapper>
	);
};

const GameImg = styled.img.attrs(({ src }: { src: string }) => {
	return {
		src,
	};
})<{ src: string }>`
	height: 48px;
	width: auto;
`;
