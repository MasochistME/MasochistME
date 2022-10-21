import React from 'react';
import styled from 'styled-components';

import { media, fonts, colors } from 'shared/theme';

type Props = {
	query: string;
	setQuery: (query: string) => void;
	placeholder?: string;
};

export const SearchBar = (props: Props): JSX.Element => {
	const { placeholder, query, setQuery } = props;

	const onSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const searchQuery = event.target.value;
		setQuery(searchQuery);
	};

	return (
		<SearchBarInput
			type="text"
			placeholder={placeholder}
			onChange={onSearch}
			value={query}
		/>
	);
};

const SearchBarInput = styled.input`
	flex: 1 1 auto;
	height: 44px;
	width: 350px;
	max-width: 350px;
	padding: 4px 12px;
	font-size: 1.2em;
	font-family: ${fonts.Raleway};
	background-color: ${colors.newDark}cc;
	border: 1px solid ${colors.newDarkBlue}cc;
	border-radius: 8px;
	box-sizing: border-box;
	&:active,
	&:focus {
		border: 1px solid ${colors.lightGrey};
		outline: none;
	}
	@media (max-width: ${media.tablets}) {
		margin-bottom: 0;
	}
`;
