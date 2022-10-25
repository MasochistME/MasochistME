import React from 'react';
import { Game, TierId } from '@masochistme/sdk/dist/v1/types';

import { useCuratedGames } from 'sdk';
import { useAppContext } from 'context';
import { Flex, Spinner, Table } from 'components';

import { useGamesColumns } from './columns';

export const GameTableView = (): JSX.Element => {
	const { visibleTiers, queryGame } = useAppContext();
	const gamesColumns = useGamesColumns();

	const { gamesData, isLoading, isFetched } = useCuratedGames();

	const games = gamesData.filter(
		(game: Game) =>
			game?.title.toLowerCase().includes(queryGame.toLowerCase()) &&
			visibleTiers.find((tier: TierId) => tier === game.tier),
	);

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
