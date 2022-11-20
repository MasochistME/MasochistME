import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';

export type Order = 'asc' | 'desc';

export type HeadCell = {
	disablePadding: boolean;
	id: string;
	label: string;
	numeric: boolean;
};

type Props = {
	headCells: HeadCell[];
	order: Order;
	orderBy: string | undefined;
	onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
};

export const TableHeader = (props: Props) => {
	const { headCells, order, orderBy, onRequestSort } = props;
	const createSortHandler =
		(property: string) => (event: React.MouseEvent<unknown>) => {
			onRequestSort(event, property);
		};

	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell: HeadCell) => (
					<TableCell
						key={String(headCell.id)}
						align={headCell.numeric ? 'right' : 'left'}
						padding={headCell.disablePadding ? 'none' : 'normal'}
						sortDirection={orderBy === headCell.id ? order : false}>
						<TableSortLabel
							active={orderBy === headCell.id}
							direction={orderBy === headCell.id ? order : 'asc'}
							onClick={createSortHandler(headCell.id)}>
							{headCell.label}
							{orderBy === headCell.id ? (
								<Box component="span" sx={visuallyHidden}>
									{order === 'desc' ? 'sorted descending' : 'sorted ascending'}
								</Box>
							) : null}
						</TableSortLabel>
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
};
