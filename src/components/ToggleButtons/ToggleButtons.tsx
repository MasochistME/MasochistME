import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import styled from 'styled-components';

import { ColorTokens } from 'styles';
import { useTheme } from 'styles';

type Option = {
	label: string;
	value: string;
};

type Props<T> = {
	value: T;
	changeValue: (value: T) => void;
	options: Option[];
};

export const ToggleButtons = <T extends string>(
	props: Props<T>,
): JSX.Element => {
	const { value, changeValue, options } = props;
	const { colorTokens } = useTheme();

	const radios = options.map(option => (
		<StyledToggleButton
			value={option.value}
			aria-label={option.value}
			colorTokens={colorTokens}>
			{option.label}
		</StyledToggleButton>
	));

	const onChange = (
		_e: React.MouseEvent<HTMLElement, MouseEvent>,
		value: T,
	) => {
		changeValue(value);
	};
	return (
		<StyledToggleButtonGroup
			value={value}
			onChange={onChange}
			exclusive
			aria-label="text alignment"
			colorTokens={colorTokens}>
			{radios}
		</StyledToggleButtonGroup>
	);
};

const StyledToggleButtonGroup = styled(ToggleButtonGroup)<{
	colorTokens: ColorTokens;
}>`
	&.MuiToggleButtonGroup-root {
		background-color: ${({ colorTokens }) =>
			colorTokens['semantic-color--interactive']};
	}
`;
const StyledToggleButton = styled(ToggleButton)<{
	colorTokens: ColorTokens;
}>`
	&.MuiButtonBase-root {
		line-height: unset;
		padding: 8px;
		color: ${({ colorTokens }) => colorTokens['core-tertiary-text']};
		&:hover {
			background-color: ${({ colorTokens }) =>
				colorTokens['semantic-color--active']};
		}
	}
	&.Mui-selected {
		background-color: ${({ colorTokens }) =>
			colorTokens['semantic-color--active']};
	}
`;
