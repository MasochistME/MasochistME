import Box from '@mui/material/Box';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';
import styled from 'styled-components';

import { ColorTokens, useTheme } from 'styles';
import { Order, TableHeaderCell } from './types';

type Props<T extends string> = {
	tableHeaderCells: TableHeaderCell[];
	order?: Order;
	orderBy?: T | undefined;
	onRequestSort?: (event: React.MouseEvent<unknown>, property: T) => void;
};

export const TableHeader = <T extends string>(props: Props<T>) => {
	const { tableHeaderCells, order, orderBy, onRequestSort } = props;
	const { colorTokens } = useTheme();

	const createSortHandler =
		(property: T) => (event: React.MouseEvent<unknown>) => {
			onRequestSort?.(event, property);
		};

	return (
		<StyledTableHeader colorTokens={colorTokens}>
			<tr>
				{tableHeaderCells.map((tableHeaderCell: TableHeaderCell) => (
					<StyledTableHeaderCell
						colorTokens={colorTokens}
						key={String(tableHeaderCell.id)}
						align={tableHeaderCell.numeric ? 'center' : 'left'}>
						<StyledTableSortLabel
							colorTokens={colorTokens}
							active={orderBy === tableHeaderCell.id}
							direction={orderBy === tableHeaderCell.id ? order : 'asc'}
							hideSortIcon
							onClick={createSortHandler(tableHeaderCell.id as unknown as T)}>
							{tableHeaderCell.label}
							{orderBy === tableHeaderCell.id ? (
								<Box component="span" sx={visuallyHidden}>
									{order === 'desc' ? 'sorted descending' : 'sorted ascending'}
								</Box>
							) : null}
						</StyledTableSortLabel>
					</StyledTableHeaderCell>
				))}
			</tr>
		</StyledTableHeader>
	);
};

const StyledTableHeader = styled.thead<{ colorTokens: ColorTokens }>`
	font-weight: 600;
	font-size: var(--font-size-14);
	line-height: var(--size-16);
	text-align: center;
	height: var(--size-50);
	background-color: ${({ colorTokens }) => colorTokens['core-secondary-bg']};
	tr > td {
		text-align: center;
	}
`;

const StyledTableHeaderCell = styled.th<{ colorTokens: ColorTokens }>`
	width: auto;
	.Mui-active {
		color: ${({ colorTokens }) => colorTokens['semantic-color--active']};
	}
`;

const StyledTableSortLabel = styled(TableSortLabel)<{
	colorTokens: ColorTokens;
}>`
	display: flex;
	align-items: center;
	justify-content: center;
	height: var(--size-50);
	.Mui-active,
	&:hover {
		color: ${({ colorTokens }) => colorTokens['semantic-color--active']};
	}

	svg {
		fill: ${({ colorTokens }) => colorTokens['semantic-color--active']};
	}
`;
