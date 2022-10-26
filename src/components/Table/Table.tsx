// import { useState } from 'react';
// import styled from 'styled-components';
// import _orderBy from 'lodash/orderBy';

// import MUITable from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TablePagination from '@mui/material/TablePagination';
// import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';

// import { colors, fonts } from 'styles/theme/themeOld';

// import { TableHeader, Order } from './TableHeader';

// type Row = {
// 	name: string;
// 	cells: React.ReactNode[];
// };

// type Props<T extends string[]> = {
// 	columns: T;
// 	rows: Row[];
// };

// export const Table = <T extends string[]>(props: Props<T>) => {
// 	const { columns, rows } = props;
// 	const [order, setOrder] = useState<Order>('asc');
// 	const [orderBy, setOrderBy] = useState<keyof T>();
// 	const [isDense, _setIsDense] = useState<boolean>(true);
// 	const [page, setPage] = useState<number>(0);
// 	const [rowsPerPage, setRowsPerPage] = useState<number>(5);

// 	const handleChangePage = (
// 		_event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
// 		newPage: number,
// 	) => {
// 		setPage(newPage);
// 	};

// 	const handleChangeRowsPerPage = (
// 		event: React.ChangeEvent<HTMLInputElement>,
// 	) => {
// 		setRowsPerPage(parseInt(event.target.value, 10));
// 		setPage(0);
// 	};

// 	const emptyRows =
// 		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

// 	const sortedRows = _orderBy(rows, [orderBy], [order]).slice(
// 		page * rowsPerPage,
// 		page * rowsPerPage + rowsPerPage,
// 	);

// 	return (
// 		<TableContainer component={Paper}>
// 			<MUITable
// 				sx={{ minWidth: 650 }}
// 				size={isDense ? 'small' : 'medium'}
// 				aria-label="simple table">
// 				<TableHeader order={order} orderBy={orderBy}>
// 					<TableRow>
// 						{columns.map(column => (
// 							<TableCell>{column}</TableCell>
// 						))}
// 					</TableRow>
// 				</TableHeader>
// 				<TableBody>
// 					{sortedRows.map(row => (
// 						<TableRow
// 							key={row.name}
// 							sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
// 							{row.cells.map(cell => (
// 								<TableCell>{cell}</TableCell>
// 							))}
// 						</TableRow>
// 					))}
// 					{emptyRows > 0 && (
// 						<TableRow
// 							style={{
// 								height: (isDense ? 33 : 53) * emptyRows,
// 							}}>
// 							<TableCell colSpan={6} />
// 						</TableRow>
// 					)}
// 				</TableBody>
// 				<TablePagination
// 					rowsPerPageOptions={[5, 10, 25]}
// 					component="div"
// 					count={rows.length}
// 					rowsPerPage={rowsPerPage}
// 					page={page}
// 					onPageChange={handleChangePage}
// 					onRowsPerPageChange={handleChangeRowsPerPage}
// 				/>
// 			</MUITable>
// 		</TableContainer>
// 	);
// };

// export const TableLink = styled.span`
// 	cursor: pointer;
// 	&:hover {
// 		color: ${colors.white};
// 	}
// `;

// export const defaultSort = (a: number | string, b: number | string): number => {
// 	if (a < b) {
// 		return -1;
// 	}
// 	if (a > b) {
// 		return 1;
// 	}
// 	return 0;
// };
export {};
