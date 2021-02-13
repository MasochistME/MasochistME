import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CheckBoxGameChoice from './CheckBoxGameChoice';
import { Wrapper, Flex, SearchBar, HoverIcon } from 'shared/components';
import { changeGamesView } from 'shared/store/modules/Tabs';
import ViewGamesTiles from './ViewGamesTiles';
import ViewGamesList from './ViewGamesList';

export default function PageAllGames(): JSX.Element {
  const dispatch = useDispatch();
  const rating = useSelector((state: any) => state.rating);
  const gamesView = useSelector((state: any) => state.games.view);

  const onGameViewClick = () => {
    if (gamesView === 'tiles') {
      dispatch(changeGamesView('list'));
    }
    if (gamesView === 'list') {
      dispatch(changeGamesView('tiles'));
    }
  };

  return (
    <Flex column>
      <Wrapper type="description">
        <div className="page-description">
          <p>
            Here&lsquo;s the list of games that 0.1% curates, as well as the
            percentage completion comparision between our users.
          </p>
          <p>
            In the 0.1% community, we grade the ranks of our users by how many
            curated games they&lsquo;ve completed, as well as the difficulty of
            those games. Each game specifies their own difficulty in the
            description.
          </p>
          <p>
            The list also includes which three users completed the game first
            (with a gold, silver and bronze medals, respectively), as well as
            the user who has completed it the fastest based on Steam timestamps
            (with a trophy).
          </p>
        </div>
        <Flex row align style={{ justifyContent: 'space-around' }}>
          {rating && gamesView === 'tiles' ? (
            <>
              <div className="wrapper-choicebar">
                {rating.map((r: any) => (
                  <CheckBoxGameChoice
                    key={`checkbox-game-${r.id}`}
                    score={r.id}
                    rating={rating}
                  />
                ))}
              </div>
              <SearchBar />
            </>
          ) : null}
          <HoverIcon
            type="fas fa-th-list"
            isActive={gamesView === 'list'}
            onClick={onGameViewClick}
            style={{ marginLeft: 'auto' }}
          />
        </Flex>
      </Wrapper>
      <ViewGamesTiles />
      <ViewGamesList />
    </Flex>
  );
}
