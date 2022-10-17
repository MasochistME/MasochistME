import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { media, fonts } from 'shared/theme';
import { useAppContext } from 'shared/store/context';
import { TabDict } from 'shared/config/tabs';

enum Query {
	MEMBER = 'member',
	GAME = 'game',
}

export const SearchBar = (): JSX.Element => {
	const { activeTab, queryGame, setQueryGame, queryMember, setQueryMember } =
		useAppContext();

	const [query, setQuery] = useState<string | undefined>();

	const adjustToTab = (): void => {
		if (activeTab === TabDict.GAMES) setQuery(Query.GAME);
		if (activeTab === TabDict.LEADERBOARDS) setQuery(Query.MEMBER);
	};

	const onSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const searchString = event.target.value;
		if (query === Query.GAME) setQueryGame(searchString);
		if (query === Query.MEMBER) setQueryMember(searchString);
	};

	useEffect(() => {
		if (activeTab) {
			adjustToTab();
		}
	}, [activeTab]);

	return (
		<Wrapper>
			<SearchBarLabel htmlFor="searchbar">Search:</SearchBarLabel>
			<SearchBarInput
				type="text"
				placeholder={`for ${query}`}
				onChange={onSearch}
				value={query === Query.GAME ? queryGame : queryMember}
			/>
		</Wrapper>
	);
};

const Wrapper = styled.div`
	display: flex;
	justify-content: flex-end;
	@media (max-width: ${media.tablets}) {
		justify-content: center;
		align-items: center;
		margin: 15px 0;
	}
`;

const SearchBarInput = styled.input`
	width: 200px;
	font-family: ${fonts.Raleway};
	@media (max-width: ${media.tablets}) {
		margin-bottom: 0;
	}
`;

const SearchBarLabel = styled.label`
	padding: 2px;
	margin-right: 10px;
`;
