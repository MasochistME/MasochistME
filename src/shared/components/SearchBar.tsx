import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchGames, searchMembers } from 'shared/store/modules/Search';

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
    <div className="wrapper-searchbar">
      <label htmlFor="searchbar" className="searchbar-label">
        Search:
      </label>
      <input
        className="searchbar"
        type="text"
        placeholder={'for ' + searchFor}
        onChange={update}
      />
    </div>
  );
}
