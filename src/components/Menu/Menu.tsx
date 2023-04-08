import * as React from 'react';
import MuiMenu, { MenuProps } from '@mui/material/Menu';
import MuiMenuItem from '@mui/material/MenuItem';
import ListSubheader from '@mui/material/ListSubheader';
import styled from 'styled-components';
import { ColorTokens, useTheme } from 'styles';

type Option = {
	value: string;
	isSubheader: boolean;
	render?: React.ReactNode;
	onSelect?: () => void;
};

type Props = {
	loadElement?: React.ReactNode;
	options?: Option[];
	setSelectedOption?: (selectedOption: string) => void;
	anchorElement: (isOpen: boolean) => React.ReactNode;
} & Partial<MenuProps>;

export const Menu = (props: Props) => {
	const { options, anchorElement, open: _, ...muiProps } = props;
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

	const { colorTokens } = useTheme();
	const isOpen = Boolean(anchorEl);

	const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const renderOptions =
		options?.map((option: Option) => {
			if (option.isSubheader)
				return <ListSubheader>{option.value}</ListSubheader>;
			return (
				<MuiMenuItem value={option.value} onClick={option.onSelect}>
					{option.render ?? option.value}
				</MuiMenuItem>
			);
		}) ?? [];

	return (
		<div>
			<AnchorWrapper aria-haspopup="true" onClick={handleClick}>
				{anchorElement(isOpen)}
			</AnchorWrapper>
			<StyledMenu
				id="basic-menu"
				anchorEl={anchorEl}
				open={isOpen}
				onClose={handleClose}
				MenuListProps={{
					'aria-labelledby': 'basic-button',
				}}
				colorTokens={colorTokens}
				{...muiProps}>
				{renderOptions && renderOptions?.length !== 0 && renderOptions}
			</StyledMenu>
		</div>
	);
};

Menu.Item = styled(MuiMenuItem)`
	display: flex;
	align-items: center;
	gap: 8px;
`;

const AnchorWrapper = styled.div`
	cursor: pointer;
`;

const StyledMenu = styled(MuiMenu)<{ colorTokens: ColorTokens }>`
	& .MuiPaper-root {
		border-radius: 8px;
		overflow: hidden;
		border: 2px solid
			${({ colorTokens }) => colorTokens['semantic-color--interactive']};
		background-color: ${({ colorTokens }) => colorTokens['core-tertiary-bg']};
		margin-top: 8px;
	}

	& .MuiList-root {
		li {
			color: ${({ colorTokens }) => colorTokens['core-primary-text']};
			font-family: var(--font-raleway);
			background-color: transparent;

			&.MuiListSubheader-root {
				color: ${({ colorTokens }) => colorTokens['core-secondary-text']};
				font-family: var(--font-dosis);
				font-size: 1.3em;
				line-height: 1.3em;
				padding: 8px 0 8px 16px;
				&:not(:first-child) {
					border-top: 1px solid
						${({ colorTokens }) => colorTokens['semantic-color--interactive']};
				}
			}
			&.MuiButtonBase-root {
				margin: 8px;
				padding: 8px;
				border-radius: 8px;
				&:hover {
					background-color: ${({ colorTokens }) =>
						colorTokens['semantic-color--interactive']};
				}
			}
		}
	}
`;
