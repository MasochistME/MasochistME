import { useState } from 'react';
import styled from 'styled-components';

import { Skeleton } from 'components';
import { Order, TableColumn, TableRow } from './types';
import { TableHeader } from './TableHeader';
import { TableBody } from './TableBody';
import { TableCell } from './TableCell';
import { TablePagination } from './TablePagination';

type Props<T> = {
	columns: TableColumn<T>[];
	dataset: T[];
	rowsPerPage?: number;
	order?: 'asc' | 'desc';
	orderBy?: string;
};

export const Table = <T extends Record<any, any>>(props: Props<T>) => {
	const {
		columns,
		dataset,
		order = 'asc',
		orderBy,
		rowsPerPage: _rowsPerPage,
	} = props;
	const [_order, setOrder] = useState<Order>(order);
	const [_orderBy, setOrderBy] = useState<string | undefined>(orderBy);
	const [page, setPage] = useState<number>(0);
	const [rowsPerPage, setRowsPerPage] = useState<number>(_rowsPerPage ?? 20);

	const fixedDataset = dataset.map(
		(item, index) =>
			columns.map(col => ({
				...col,
				...(col.value ? { value: col.value(item, index) } : {}),
				...(col.render ? { render: col.render(item, index) } : {}),
			})) as {
				key: string;
				title: React.ReactNode;
				value: string | number;
				render: React.ReactNode;
				style?: React.CSSProperties;
			}[],
	);

	const fixedColumns = (fixedDataset[0] ?? []).map(col => ({
		key: col.key,
		title: col.title,
		...(col.style ? { style: col.style } : {}),
	}));
	const fixedRows: TableRow[][] = fixedDataset.map(row =>
		row.map(item => ({
			key: item.key,
			value: item.value,
			cell: item.render ?? item.value ?? '—',
		})),
	);

	const handleRequestSort = (
		_event: React.MouseEvent<unknown>,
		property: string,
	) => {
		setOrderBy(property);
		setOrder(_order === 'asc' ? 'desc' : 'asc');
	};

	const tableHeaderCells = fixedColumns.map(column => ({
		disablePadding: false,
		id: column.key,
		label: column.title,
		numeric: false,
	}));

	const colGroup = fixedColumns.map(col => <col style={col.style ?? {}} />);

	return (
		<StyledTable className="MuiTable-root" aria-label="simple table">
			<colgroup>{colGroup}</colgroup>
			<TableHeader
				order={_order}
				orderBy={_orderBy}
				tableHeaderCells={tableHeaderCells}
				onRequestSort={handleRequestSort}
			/>
			<TableBody
				rows={fixedRows}
				page={page}
				rowsPerPage={rowsPerPage}
				order={_order}
				orderBy={_orderBy}
			/>
			<TablePagination
				rows={fixedRows}
				page={page}
				setPage={setPage}
				rowsPerPage={rowsPerPage}
				setRowsPerPage={setRowsPerPage}
			/>
		</StyledTable>
	);
};
Table.Skeleton = <T extends Record<any, any>>({
	columns,
	style = {},
}: Pick<Props<T>, 'columns'> & { style?: React.CSSProperties }) => {
	const mock = columns.map(column => ({
		...column,
		value: () => '',
		render: () => (
			<TableCell
				content={
					<Skeleton height="3.6rem" style={{ flex: '1 1 auto', ...style }} />
				}
			/>
		),
	}));
	return (
		<Table columns={mock} dataset={new Array(10).fill({})} rowsPerPage={10} />
	);
};

const StyledTable = styled.table`
	width: 100%;
	border-spacing: 0;
	table-layout: auto;
	td,
	th {
		padding: 0 var(--size-4);
		width: var(--size-1);
	}
	td {
		font-size: var(--font-size-14);
	}
	td + {
		padding: 0 var(--size-4);
		margin: 0;
		border: none;
	}
`;
