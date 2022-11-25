import { Badge } from '@masochistme/sdk/dist/v1/types';

import { Flex, Table, Spinner, TableColumn, TableCell } from 'components';
import { BadgeThumbnail } from 'containers';
import { useBadges } from 'sdk';

import { CellGame } from './columns';

enum Columns {
	NAME = 'Name',
	ICON = 'Icon',
	POINTS = 'Pts',
	GAME = 'Game',
	DESCRIPTION = 'Description',
	REQUIREMENTS = 'Requirements',
	EARNED_BY = 'Earned by',
}

export const BadgesTableView = () => {
	const { badgesData, isLoading, isFetched } = useBadges({
		sort: { points: 'desc' },
	});

	const columns: TableColumn<Badge>[] = [
		{
			key: Columns.NAME,
			title: Columns.NAME,
			value: (badge: Badge) => badge.name,
			render: (badge: Badge) => (
				<TableCell
					content={
						<Flex align gap={8} textAlign="left">
							<BadgeThumbnail badge={badge} />
							{badge.name}
						</Flex>
					}
					fontWeight={600}
					justifyContent="flex-start"
				/>
			),
			style: { width: '15%' },
		},
		{
			key: Columns.POINTS,
			title: Columns.POINTS,
			value: (badge: Badge) => badge.points,
			render: (badge: Badge) => <TableCell content={badge.points} />,
			style: { width: '20px' },
		},
		{
			key: Columns.GAME,
			title: Columns.GAME,
			value: (badge: Badge) => badge.gameId ?? badge.title,
			render: (badge: Badge) => <CellGame badge={badge} />,
			style: { width: '15%' },
		},
		{
			key: Columns.DESCRIPTION,
			title: Columns.DESCRIPTION,
			value: (badge: Badge) => badge.description,
			render: (badge: Badge) => (
				<TableCell content={badge.description} fontStyle="italic" />
			),
		},
		{
			key: Columns.REQUIREMENTS,
			title: Columns.REQUIREMENTS,
			value: (badge: Badge) => badge.requirements,
			render: (badge: Badge) => <TableCell content={badge.requirements} />,
			style: { width: '15%' },
		},
	];

	return (
		<Flex width="100%">
			{isLoading && <Spinner />}
			{isFetched && <Table columns={columns} dataset={badgesData} />}
		</Flex>
	);
};
