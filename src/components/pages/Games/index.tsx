import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { orderBy } from 'lodash';
import CheckBoxGameChoice from './CheckBoxGameChoice';
import SearchBar from 'shared/components/SearchBar';
import { Wrapper, Spinner, Flex } from 'shared/components';
import Game from './Game';

const WrapperGames = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  margin: 0;
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
  background-color: $darkbluetransparent;
`;

export default function PageGames(): JSX.Element {
  const searchGame = useSelector((state: any) => state.search.game);
  const showGamesRated = useSelector((state: any) => state.showGamesRated);
  const rating = useSelector((state: any) => state.rating);
  const games = useSelector((state: any) =>
    orderBy(
      state.games.list,
      ['rating', game => game.title.toLowerCase()],
      ['desc', 'asc'],
    ),
  );

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
        {rating ? (
          <div className="wrapper-filter">
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
          </div>
        ) : null}
      </Wrapper>
      <WrapperGames>
        {games && games.length ? (
          games.map((game: any) => {
            return game?.title
              .toLowerCase()
              .indexOf(searchGame.toLowerCase()) !== -1 &&
              showGamesRated.find(
                (score: any) =>
                  parseInt(score, 10) === parseInt(game.rating, 10),
              ) ? (
              <Game key={`id-game-${game.id}`} id={game.id} rating={rating} />
            ) : null;
          })
        ) : (
          <Spinner />
        )}
      </WrapperGames>
    </Flex>
  );
}
