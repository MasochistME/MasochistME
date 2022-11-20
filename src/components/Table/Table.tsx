import { useState } from 'react';
import styled from 'styled-components';
import _orderBy from 'lodash/orderBy';

import MUITable from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { ColorTokens, useTheme } from 'styles';

import { TableHeader, Order } from './TableHeader';

type Row = {
	name: string;
	cells: React.ReactNode[];
};

type Props<T extends string[]> = {
	columns: T;
	rows: Row[];
};

export const Table = <T extends string[]>(props: Props<T>) => {
	const { columns, rows } = props;
	const { colorTokens } = useTheme();
	const [order, setOrder] = useState<Order>('asc');
	const [orderBy, setOrderBy] = useState<string | undefined>();
	const [isDense, _setIsDense] = useState<boolean>(true);
	const [page, setPage] = useState<number>(0);
	const [rowsPerPage, setRowsPerPage] = useState<number>(20);

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
		property: string,
	) => {
		setOrderBy(property);
		if (order === 'asc') setOrder('desc');
		else setOrder('asc');
	};

	const emptyRows =
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

	const sortedRows = _orderBy(rows, [orderBy], [order]).slice(
		page * rowsPerPage,
		page * rowsPerPage + rowsPerPage,
	) as unknown as Row[];

	const headCells = columns.map(column => ({
		disablePadding: false,
		id: column,
		label: column,
		numeric: false,
	}));

	return (
		<TableContainer component={Paper}>
			<MUITable
				// sx={{ minWidth: 650 }}
				size={isDense ? 'small' : 'medium'}
				aria-label="simple table">
				<TableHeader
					order={order}
					orderBy={orderBy}
					headCells={headCells}
					onRequestSort={handleRequestSort}
				/>
				<TableBody>
					{sortedRows.map(row => (
						<TableRow
							sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
							{row.cells.map((cell: React.ReactNode) => (
								<TableCell>{cell}</TableCell>
							))}
						</TableRow>
					))}
					{emptyRows > 0 && (
						<TableRow
							style={{
								height: (isDense ? 33 : 53) * emptyRows,
							}}>
							<TableCell />
						</TableRow>
					)}
				</TableBody>
				<TablePagination
					rowsPerPageOptions={[10, 20, 50]}
					component="div"
					count={rows.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</MUITable>
		</TableContainer>
	);
};

export const TableLink = styled.span<{ colorTokens: ColorTokens }>`
	cursor: pointer;
	&:hover {
		color: ${({ colorTokens }) => colorTokens['common-color--white']};
	}
`;

export const defaultSort = (a: number | string, b: number | string): number => {
	if (a < b) {
		return -1;
	}
	if (a > b) {
		return 1;
	}
	return 0;
};
