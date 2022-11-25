import _orderBy from 'lodash/orderBy';
import styled from 'styled-components';
import { ColorTokens, useTheme } from 'styles';

import { Row, Order } from './types';

type Props<T extends string> = {
	rows: Record<T, Row>[];
	page: number;
	rowsPerPage: number;
	order: Order;
	orderBy?: T;
};

export const TableBody = <T extends string>(props: Props<T>) => {
	const { rows, page, rowsPerPage, order, orderBy } = props;
	const { colorTokens } = useTheme();

	const rowsValues = Object.values(rows);

	const emptyRows =
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rowsValues.length) : 0;

	const sortedRows = _orderBy(rows, [`${orderBy}.value`], [order]).slice(
		page * rowsPerPage,
		page * rowsPerPage + rowsPerPage,
	);

	return (
		<tbody className="MuiTableBody-root">
			{sortedRows.map(row => {
				const rowValues: Row[] = Object.values(row);
				return (
					<TableRow colorTokens={colorTokens} className="MuiTableRow-root">
						{rowValues.map((cell: Row) => (
							<TableCell
								colorTokens={colorTokens}
								className="MuiTableCell-root">
								{cell.cell ?? cell.value ?? '—'}
							</TableCell>
						))}
					</TableRow>
				);
			})}
			{emptyRows > 0 && (
				<TableRow
					colorTokens={colorTokens}
					className="MuiTableRow-root"
					style={{
						height: 33 * emptyRows,
					}}>
					<TableCell colorTokens={colorTokens} className="MuiTableCell-root" />
				</TableRow>
			)}
		</tbody>
	);
};

const TableRow = styled.tr<{ colorTokens: ColorTokens }>`
	background-color: ${({ colorTokens }) => colorTokens['core-primary-bg']}99;
	border-bottom: 5px solid
		${({ colorTokens }) => colorTokens['common-color--shadow']};
	cursor: pointer;
	&:last-child > td {
		border-bottom: none;
	}
	&:hover {
		background-color: ${({ colorTokens }) =>
			colorTokens['semantic-color--interactive']}99;
	}
`;

const TableCell = styled.td<{ colorTokens: ColorTokens }>`
	margin: 0;
	text-align: center;
	width: 1px;
	&:first-child {
		padding: 0;
	}
`;
