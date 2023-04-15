import React from 'react';
import {
	Select as MuiSelect,
	SelectChangeEvent,
	MenuItem,
	ListSubheader,
} from '@mui/material';
import styled from 'styled-components';
import { ColorTokens, useTheme } from 'styles';

type Option = {
	value: string;
	render?: React.ReactNode;
	isSubheader: boolean;
};
type Props = {
	options: Option[];
	selectedOption: string;
	setSelectedOption: (selectedOption: string) => void;
	defaultSelection?: string;
	placeholder?: string;
};
export const Select = (props: Props) => {
	const {
		options,
		selectedOption,
		setSelectedOption,
		placeholder = 'Select...',
	} = props;
	const { colorTokens } = useTheme();

	const handleChange = (event: SelectChangeEvent<unknown>) => {
		setSelectedOption(event.target.value as string);
	};

	const renderValue = () => {
		if (selectedOption.length === 0)
			return <span className="placeholder">{placeholder}</span>;
		return options.find(o => o.value === selectedOption)?.render;
	};

	const renderOptions = options.map((option: Option) => {
		if (option.isSubheader)
			return <ListSubheader>{option.value}</ListSubheader>;
		return (
			<MenuItem value={option.value}>{option.render ?? option.value}</MenuItem>
		);
	});

	return (
		<StyledSelect
			displayEmpty
			value={selectedOption}
			onChange={handleChange}
			colorTokens={colorTokens}
			renderValue={renderValue}>
			{renderOptions}
		</StyledSelect>
	);
};

const StyledSelect = styled(MuiSelect)<{ colorTokens: ColorTokens }>`
	font-family: var(--font-raleway);
	font-size: var(--font-size-18);
	color: ${({ colorTokens }) => colorTokens['core-primary-text']};
	&.MuiInputBase-root {
		background-color: ${({ colorTokens }) =>
			colorTokens['semantic-color--interactive']};
		flex: 1 1 auto;
		width: 100%;
		border-radius: var(--border-radius-32);
	}
	&.MuiOutlinedInput-root {
		outline: none;
		border: none;
	}
	& .MuiSelect-select {
		padding: var(--size-8) var(--size-16);
	}
	svg {
		color: ${({ colorTokens }) => colorTokens['core-primary-text']};
	}

	.placeholder {
		color: ${({ colorTokens }) => colorTokens['core-secondary-text']};
		font-weight: 300;
	}
`;
