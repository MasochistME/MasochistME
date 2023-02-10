import React from 'react';
import styled from 'styled-components';

import { media, fonts, useTheme, ColorTokens } from 'styles';
import { Flex } from 'components';

type Props<T extends string> = {
	query: T;
	setQuery: (query: T) => void;
	placeholder?: string;
	error?: string;
	onEnterPress?: () => void;
};

export const Input = <T extends string>(props: Props<T>): JSX.Element => {
	const { colorTokens } = useTheme();
	const { query, setQuery, onEnterPress, placeholder, error } = props;

	const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (onEnterPress && event.key === 'Enter') onEnterPress();
	};
	const onSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const searchQuery = event.target.value as T;
		setQuery(searchQuery);
	};

	return (
		<StyledInputWrapper>
			<StyledInput
				type="text"
				placeholder={placeholder}
				onChange={onSearch}
				value={query}
				colorTokens={colorTokens}
				onKeyDown={onKeyDown}
				isError={!!error}
			/>
			{!!error && (
				<StyledInputError colorTokens={colorTokens}>{error}</StyledInputError>
			)}
		</StyledInputWrapper>
	);
};

const StyledInputWrapper = styled.div`
	display: flex;
	flex-direction: column;
	width: 300px;
	max-width: 300px;
`;
const StyledInputError = styled.span<{
	colorTokens: ColorTokens;
}>`
	font-size: 0.8em;
	color: ${({ colorTokens }) => colorTokens['semantic-color--error-strong']};
`;
const StyledInput = styled.input<{
	colorTokens: ColorTokens;
	isError: boolean;
}>`
	flex: 1 1 auto;
	height: 44px;
	padding: 4px 12px;
	font-size: 1.2em;
	font-family: ${fonts.Raleway};
	background-color: ${({ colorTokens }) => colorTokens['core-primary-bg']}cc;
	color: ${({ colorTokens }) => colorTokens['core-primary-text']};
	border: 1px solid
		${({ colorTokens, isError }) =>
			isError
				? colorTokens['semantic-color--error-strong']
				: colorTokens['semantic-color--idle']}cc;
	border-radius: 8px;
	box-sizing: border-box;
	&:active,
	&:focus {
		border: 1px solid
			${({ colorTokens, isError }) =>
				isError
					? colorTokens['semantic-color--error-strong']
					: colorTokens['core-secondary-text']}cc;
		outline: none;
	}
	&::placeholder {
		color: ${({ colorTokens }) => colorTokens['core-primary-text']}88;
	}
	@media (max-width: ${media.tablets}) {
		margin-bottom: 0;
	}
`;
