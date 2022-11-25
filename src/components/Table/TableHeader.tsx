import Box from '@mui/material/Box';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';
import styled from 'styled-components';

import { ColorTokens, useTheme } from 'styles';
import { Order, HeadCell } from './types';

type Props<T extends string> = {
	headCells: HeadCell[];
	order: Order;
	orderBy: T | undefined;
	onRequestSort: (event: React.MouseEvent<unknown>, property: T) => void;
};

export const TableHeader = <T extends string>(props: Props<T>) => {
	const { headCells, order, orderBy, onRequestSort } = props;
	const { colorTokens } = useTheme();

	const createSortHandler =
		(property: T) => (event: React.MouseEvent<unknown>) => {
			onRequestSort(event, property);
		};

	return (
		<StyledTableHeader colorTokens={colorTokens} className="MuiTableHead-root">
			<tr className="MuiTableRow-root">
				{headCells.map((headCell: HeadCell) => (
					<StyledTableHeaderCell
						colorTokens={colorTokens}
						className="MuiTableCell-root"
						key={String(headCell.id)}
						align={headCell.numeric ? 'center' : 'left'}>
						<StyledTableSortLabel
							colorTokens={colorTokens}
							active={orderBy === headCell.id}
							direction={orderBy === headCell.id ? order : 'asc'}
							onClick={createSortHandler(headCell.id as unknown as T)}>
							{headCell.label}
							{orderBy === headCell.id ? (
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
	text-align: center;
	height: 50px;
	background-color: ${({ colorTokens }) => colorTokens['core-secondary-bg']};
	tr > td {
		text-align: center;
	}
`;

const StyledTableHeaderCell = styled.th<{ colorTokens: ColorTokens }>`
	padding: 0 4px;
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
	height: 50px;
	.Mui-active,
	&:hover {
		color: ${({ colorTokens }) => colorTokens['semantic-color--active']};
	}

	svg {
		fill: ${({ colorTokens }) => colorTokens['semantic-color--active']};
	}
`;
