import { useState } from 'react';
import styled from 'styled-components';

import TablePagination from '@mui/material/TablePagination';

import { useTheme } from 'styles';

import { Row, Order } from './types';
import { TableHeader } from './TableHeader';
import { TableBody } from './TableBody';

type Props<T extends string> = {
	columns: T[];
	rows: Record<T, Row>[];
	bigColumn?: number;
};

export const Table = <T extends string>(props: Props<T>) => {
	const { columns, rows, bigColumn = 0 } = props;
	const { colorTokens } = useTheme();
	const [order, setOrder] = useState<Order>('asc');
	const [orderBy, setOrderBy] = useState<T>();
	const [page, setPage] = useState<number>(0);
	const [rowsPerPage, setRowsPerPage] = useState<number>(20);

	const rowsValues = Object.values(rows);

	const handleChangePage = (
		_event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
		newPage: number,
	) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleRequestSort = (
		_event: React.MouseEvent<unknown>,
		property: T,
	) => {
		setOrderBy(property);
		if (order === 'asc') setOrder('desc');
		else setOrder('asc');
	};

	const headCells = columns.map(column => ({
		disablePadding: false,
		id: column,
		label: column,
		numeric: false,
	}));

	return (
		<StyledTable
			bigColumn={bigColumn}
			className="MuiTable-root"
			aria-label="simple table">
			<TableHeader
				order={order}
				orderBy={orderBy}
				headCells={headCells}
				onRequestSort={handleRequestSort}
			/>
			<TableBody
				rows={rows}
				page={page}
				rowsPerPage={rowsPerPage}
				order={order}
				orderBy={orderBy}
			/>
			<TablePagination
				rowsPerPageOptions={[10, 20, 50]}
				component="div"
				count={rowsValues.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
		</StyledTable>
	);
};

const StyledTable = styled.table<{ bigColumn: number }>`
	width: 100%;
	border-spacing: 0;
	table-layout: auto;
	td {
		width: 1px;
	}
	td + td {
		padding: 0 4px;
		margin: 0;
		border: none;
	}
	td:nth-child(${({ bigColumn }) => bigColumn}) {
		width: 100%;
	}
`;
