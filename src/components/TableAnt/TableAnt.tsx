import { Table as AntdTable } from 'antd';
import styled from 'styled-components';

import { fonts, ColorTokens } from 'styles';

interface Props extends React.ComponentProps<typeof AntdTable> {
	clickable?: boolean;
	colorTokens: ColorTokens;
}

export const TableAnt: any = styled(AntdTable)<Props>`
	width: 100%;
	table {
		width: 100%;
		border-spacing: 0;
		border-color: #000;
	}
	.ant-table-thead {
		background: ${({ colorTokens }) => colorTokens['core-secondary-bg']};
		height: 50px;
		tr .ant-table-cell {
			border-top: none;
		}
	}
	.ant-table-row {
		background-color: ${({ colorTokens }) => colorTokens['core-primary-bg']}99;
		border-bottom: 5px solid
			${({ colorTokens }) => colorTokens['common-color--shadow']};
		cursor: ${({ clickable }) => (clickable ? 'pointer' : 'default')};
		&:last-child {
			.ant-table-cell {
				border-bottom: none;
			}
		}
		&:hover {
			background-color: ${({ clickable, colorTokens }) =>
				clickable
					? `${colorTokens['semantic-color--interactive']}99`
					: `${colorTokens['semantic-color--interactive']}}77`};
		}
	}
	.ant-table-cell {
		margin: 0;
		text-align: center;
		border-top: 1px solid
			${({ colorTokens }) => colorTokens['common-color--light']};
		border-bottom: 1px solid
			${({ colorTokens }) => colorTokens['common-color--shadow']};
		&:first-child {
			padding: 0;
		}
	}

	.ant-table-column-sorters {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		cursor: pointer;
	}

	.ant-table-column-sorter-inner {
		align-self: flex-end;
		span {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			margin-left: 4px;
			color: ${({ colorTokens }) => colorTokens['core-extra-bg']};
			svg {
				width: 10px;
				height: 10px;
			}
		}
		.active {
			color: ${({ colorTokens }) => colorTokens['core-primary-text']}};
		}
	}

	.ant-pagination {
		list-style-type: none;
		display: flex;
		flex-direction: row;
		margin: 12px 0 0 0;
		padding: 0;
		justify-content: flex-end;
		li {
			display: flex;
			width: 32px;
			height: 32px;
			justify-content: center;
			align-items: center;
			margin: 0 4px;
			border-radius: 4px;
			cursor: pointer;
			color: ${({ colorTokens }) => colorTokens['core-primary-text']}};
			font-family: ${fonts.Dosis};
			button {
				width: 100%;
				height: 100%;
				border: none;
				border-radius: 4px;
				background: ${({ colorTokens }) => colorTokens['core-primary-text']}99;
				cursor: pointer;
			}
			&:hover {
				background: ${({ colorTokens }) => colorTokens['core-secondary-bg']}99;
			}
		}
	}

	.ant-pagination-item-active {
		background-color: ${({ colorTokens }) => colorTokens['core-secondary-bg']};66;
	}

	.ant-pagination-item-container {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		.ant-pagination-item-ellipsis {
			display: none;
		}
	}
`;

export const TableLink = styled.span<{ colorTokens: ColorTokens }>`
	font-weight: bold;
	cursor: pointer;
	&:hover {
		color: ${({ colorTokens }) => colorTokens['semantic-color--link-hover']};
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
