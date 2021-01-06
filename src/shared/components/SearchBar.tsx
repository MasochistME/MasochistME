import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { media, fonts } from 'shared/theme';
import { searchGames, searchMembers } from 'shared/store/modules/Search';

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
  margin-bottom: 20px;
  @media (max-width: ${media.tablets}) {
    margin-bottom: 0;
  }
`;
const SearchBarLabel = styled.label`
  padding: 2px;
  margin-right: 10px;
`;

export default function SearchBar(): JSX.Element {
  const dispatch = useDispatch();
  const activeTab = useSelector((state: any) => state.activeTab);

  const [searchFor, setSearchFor] = useState(undefined as string | undefined);

  const adjustToTab = (): void => {
    switch (activeTab) {
      case 'games': {
        setSearchFor('games');
        return;
      }
      case 'ranking': {
        setSearchFor('users');
        return;
      }
      default:
        return;
    }
  };

  const update = (event: any): void => {
    const searchString = event.target.value;
    switch (searchFor) {
      case 'games': {
        dispatch(searchGames(searchString));
        return;
      }
      case 'users': {
        dispatch(searchMembers(searchString));
        return;
      }
      default:
        return;
    }
  };

  useEffect(() => {
    adjustToTab();
  }, []);

  return (
    <Wrapper>
      <SearchBarLabel htmlFor="searchbar">Search:</SearchBarLabel>
      <SearchBarInput
        type="text"
        placeholder={'for ' + searchFor}
        onChange={update}
      />
    </Wrapper>
  );
}
