import React from 'react';
import { useSelector } from 'react-redux';
import { orderBy } from 'lodash';
import CheckBoxGameChoice from './CheckBoxGameChoice';
import SearchBar from 'shared/components/SearchBar';
import { Wrapper, Spinner } from 'shared/components';

import Game from './Game';

export default function PageGames(): JSX.Element {
  const searchGame = useSelector((state: any) => state.searchGame);
  const showGamesRated = useSelector((state: any) => state.showGamesRated);
  const rating = useSelector((state: any) => state.rating);
  const games = useSelector((state: any) =>
    orderBy(
      state.games,
      ['rating', game => game.title.toLowerCase()],
      ['desc', 'asc'],
    ),
  );

  return (
    <div className="flex-column">
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
      <div className="wrapper-games">
        {games && games.length ? (
          games.map((game: any) =>
            game.title.toLowerCase().indexOf(searchGame.toLowerCase()) !== -1 &&
            showGamesRated.find(
              (score: any) => parseInt(score, 10) === parseInt(game.rating, 10),
            ) ? (
              <Game key={`id-game-${game.id}`} game={game} rating={rating} />
            ) : null,
          )
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  );
}
