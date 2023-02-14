import * as React from 'react';
import MuiMenu, { MenuProps } from '@mui/material/Menu';
import MuiMenuItem from '@mui/material/MenuItem';
import ListSubheader from '@mui/material/ListSubheader';
import styled from 'styled-components';

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
			<MuiMenu
				id="basic-menu"
				anchorEl={anchorEl}
				open={isOpen}
				onClose={handleClose}
				MenuListProps={{
					'aria-labelledby': 'basic-button',
				}}
				{...muiProps}>
				{renderOptions && renderOptions?.length !== 0 && renderOptions}
			</MuiMenu>
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
