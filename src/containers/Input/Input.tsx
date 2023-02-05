import React from 'react';
import styled from 'styled-components';

import { media, fonts, useTheme, ColorTokens } from 'styles';

type Props<T extends string> = {
	query: T;
	setQuery: (query: T) => void;
	placeholder?: string;
};

export const Input = <T extends string>(props: Props<T>): JSX.Element => {
	const { colorTokens } = useTheme();
	const { placeholder, query, setQuery } = props;

	const onSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const searchQuery = event.target.value as T;
		setQuery(searchQuery);
	};

	return (
		<StyledInput
			type="text"
			placeholder={placeholder}
			onChange={onSearch}
			value={query}
			colorTokens={colorTokens}
		/>
	);
};

const StyledInput = styled.input<{ colorTokens: ColorTokens }>`
	flex: 1 1 auto;
	height: 44px;
	width: 350px;
	max-width: 350px;
	padding: 4px 12px;
	font-size: 1.2em;
	font-family: ${fonts.Raleway};
	background-color: ${({ colorTokens }) => colorTokens['core-primary-bg']}cc;
	color: ${({ colorTokens }) => colorTokens['core-primary-text']};
	border: 1px solid
		${({ colorTokens }) => colorTokens['semantic-color--idle']}cc;
	border-radius: 8px;
	box-sizing: border-box;
	&:active,
	&:focus {
		border: 1px solid ${({ colorTokens }) => colorTokens['core-secondary-text']};
		outline: none;
	}
	&::placeholder {
		color: ${({ colorTokens }) => colorTokens['core-primary-text']}88;
	}
	@media (max-width: ${media.tablets}) {
		margin-bottom: 0;
	}
`;
