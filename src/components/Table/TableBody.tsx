import _orderBy from 'lodash/orderBy';
import styled from 'styled-components';
import { ColorTokens, useTheme } from 'styles';

import { TableRow, Order } from './types';

type Props<T extends string> = {
	rows: TableRow[][];
	page?: number;
	rowsPerPage?: number;
	order?: Order;
	orderBy?: T;
};

export const TableBody = <T extends string>(props: Props<T>) => {
	const { rows, page = 1, rowsPerPage = 10, order = 'asc', orderBy } = props;
	const { colorTokens } = useTheme();

	const emptyRows =
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

	const sortedRows = _orderBy(
		rows,
		(resultItem: TableRow[]) => {
			const itemOrderBy = resultItem.find(item => item.key === orderBy) ?? {
				value: 0,
			};
			return itemOrderBy.value;
		},
		[order],
	).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

	return (
		<tbody>
			{sortedRows.map(row => {
				return (
					<StyledTableRow colorTokens={colorTokens}>
						{row.map((cell: TableRow, index: number) => (
							<StyledTableCell
								key={`${cell.key}-${index}`}
								colorTokens={colorTokens}>
								{cell.cell}
							</StyledTableCell>
						))}
					</StyledTableRow>
				);
			})}
			{emptyRows > 0 && (
				<StyledTableRow
					colorTokens={colorTokens}
					style={{
						height: 33 * emptyRows,
					}}>
					<StyledTableCell colorTokens={colorTokens} />
				</StyledTableRow>
			)}
		</tbody>
	);
};

const StyledTableRow = styled.tr<{ colorTokens: ColorTokens }>`
	background-color: ${({ colorTokens }) => colorTokens['core-primary-bg']}99;
	cursor: pointer;
	&:last-child > td {
		border-bottom: none;
	}
	&:hover {
		background-color: ${({ colorTokens }) =>
			colorTokens['semantic-color--interactive']}99;
	}
`;

const StyledTableCell = styled.td<{ colorTokens: ColorTokens }>`
	text-align: center;
	border-bottom: var(--size-2) solid
		${({ colorTokens }) => colorTokens['core-secondary-bg']};
`;
