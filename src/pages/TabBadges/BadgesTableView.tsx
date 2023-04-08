import { Badge } from '@masochistme/sdk/dist/v1/types';

import {
	Flex,
	Table,
	TableColumn,
	TableCell,
	QueryBoundary,
	ErrorFallback,
} from 'components';
import { BadgeThumbnail } from 'containers';
import { useBadges } from 'sdk';

import { CellGame } from './columns';

enum Columns {
	NAME = 'Name',
	POINTS = 'Pts',
	GAME = 'Game',
	DESCRIPTION = 'Description',
	REQUIREMENTS = 'Requirements',
}

export const BadgesTableView = () => (
	<QueryBoundary
		fallback={
			<Table.Skeleton columns={columns} style={{ margin: '0.6rem 0' }} />
		}
		errorFallback={<ErrorFallback />}>
		<BadgesTableViewBoundary />
	</QueryBoundary>
);

const BadgesTableViewBoundary = () => {
	const { badgesData } = useBadges({
		sort: { points: 'desc' },
	});

	return (
		<Flex width="100%">
			<Table columns={columns} dataset={badgesData} rowsPerPage={10} />
		</Flex>
	);
};

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
		style: { width: '2rem' },
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
