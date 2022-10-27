import React from 'react';
import styled from 'styled-components';

import { media, fonts } from 'styles/theme/themeOld';
import { useTheme, ColorTokens } from 'styles';

type Props<T extends string> = {
	query: T;
	setQuery: (query: T) => void;
	placeholder?: string;
};

export const SearchBar = <T extends string>(props: Props<T>): JSX.Element => {
	const { colorTokens } = useTheme();
	const { placeholder, query, setQuery } = props;

	const onSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const searchQuery = event.target.value as T;
		setQuery(searchQuery);
	};

	return (
		<SearchBarInput
			type="text"
			placeholder={placeholder}
			onChange={onSearch}
			value={query}
			colorTokens={colorTokens}
		/>
	);
};

const SearchBarInput = styled.input<{ colorTokens: ColorTokens }>`
	flex: 1 1 auto;
	height: 44px;
	width: 350px;
	max-width: 350px;
	padding: 4px 12px;
	font-size: 1.2em;
	font-family: ${fonts.Raleway};
	background-color: ${({ colorTokens }) => colorTokens['core-primary-bg']}cc;
	border: 1px solid
		${({ colorTokens }) => colorTokens['semantic-color--idle']}cc;
	border-radius: 8px;
	box-sizing: border-box;
	&:active,
	&:focus {
		border: 1px solid ${({ colorTokens }) => colorTokens['core-secondary-text']};
		outline: none;
	}
	@media (max-width: ${media.tablets}) {
		margin-bottom: 0;
	}
`;
