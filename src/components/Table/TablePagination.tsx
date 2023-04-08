import TablePaginationUnstyled, {
	tablePaginationUnstyledClasses as classes,
} from '@mui/base/TablePaginationUnstyled';
import styled from 'styled-components';

import { useTheme, ColorTokens } from 'styles';
import { TableRow } from './types';

type Props = {
	rows: TableRow[][];
	page: number;
	setPage: (page: number) => void;
	rowsPerPage: number;
	setRowsPerPage: (rowsPerPage: number) => void;
};

export const TablePagination = (props: Props) => {
	const { rows, page, setPage, rowsPerPage, setRowsPerPage } = props;
	const { colorTokens } = useTheme();

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

	return (
		<StyledTablePaginationFooter colorTokens={colorTokens}>
			<tr>
				<StyledTablePagination
					colorTokens={colorTokens}
					rowsPerPageOptions={[10, 20, 50]}
					count={rows.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</tr>
		</StyledTablePaginationFooter>
	);
};

const StyledTablePaginationFooter = styled.tfoot<{
	colorTokens: ColorTokens;
}>`
	font-weight: 600;
	text-align: center;
	height: 50px;
	background-color: ${({ colorTokens }) => colorTokens['core-secondary-bg']};
	tr {
	}
`;

const StyledTablePagination = styled(TablePaginationUnstyled)<{
	colorTokens: ColorTokens;
}>`
	& .${classes.spacer} {
		display: none;
	}

	& .${classes.toolbar} {
		padding: 0 16px;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 10px;

		@media (min-width: 768px) {
			flex-direction: row;
			align-items: center;
		}
	}

	& .${classes.selectLabel} {
		margin: 0;
		@media (max-width: 768px) {
			display: none;
		}
	}

	& .${classes.select} {
		padding: 4px;
		border: 2px solid
			${({ colorTokens }) => colorTokens['semantic-color--idle']};
		border-radius: 50px;
		background-color: ${({ colorTokens }) => colorTokens['core-primary-bg']};
		color: ${({ colorTokens }) => colorTokens['core-primary-text']};
		font-family: var(--font-raleway);
		font-size: 1.2em;
		cursor: pointer;

		&:hover {
			background-color: ${({ colorTokens }) =>
				colorTokens['semantic-color--interactive']};
		}

		&:focus {
			outline: 1px solid
				${({ colorTokens }) => colorTokens['semantic-color--active']};
		}
	}

	& .${classes.displayedRows} {
		margin-left: auto;
	}

	& .${classes.actions} {
		padding: 2px;
		text-align: center;
	}

	& .${classes.actions} > button {
		margin: 0 8px;
		padding: 6px 12px;
		border: transparent;
		border-radius: 2px;
		font-size: 1.2em;
		cursor: pointer;
		color: black;
		background-color: ${({ colorTokens }) =>
			colorTokens['semantic-color--interactive']};

		&:hover {
			background-color: ${({ colorTokens }) =>
				colorTokens['semantic-color--active']};
		}

		&:focus {
			outline: 1px solid
				${({ colorTokens }) => colorTokens['semantic-color--active']};
		}
	}

	& .MuiTablePaginationUnstyled-toolbar {
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
`;
