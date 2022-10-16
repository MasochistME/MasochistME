import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { media, fonts } from 'shared/theme';
import { searchGames, searchUsers } from 'shared/store/modules/Search';
import { useAppContext } from 'shared/store/context';
import { TabDict } from 'shared/config/tabs';

export const SearchBar = (): JSX.Element => {
	const dispatch = useDispatch();
	const { activeTab } = useAppContext();

	const [searchFor, setSearchFor] = useState<string | undefined>();

	const adjustToTab = (): void => {
		if (activeTab === TabDict.GAMES) setSearchFor('game');
		if (activeTab === TabDict.LEADERBOARDS) setSearchFor('user');
	};

	const onSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const searchString = event.target.value;
		switch (searchFor) {
			case 'game': {
				dispatch(searchGames(searchString));
				return;
			}
			case 'user': {
				dispatch(searchUsers(searchString));
				return;
			}
			default:
				return;
		}
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
				placeholder={`for ${searchFor}`}
				onChange={onSearch}
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
