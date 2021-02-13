import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { orderBy } from 'lodash';
import MUIDataTable from 'mui-datatables';
import CheckBoxGameChoice from './CheckBoxGameChoice';
import {
  Wrapper,
  Spinner,
  Flex,
  SearchBar,
  HoverIcon,
} from 'shared/components';
import { changeGamesView } from 'shared/store/modules/Tabs';
import Game from './Game';

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
      <Wrapper type="page">
        {gamesView === 'tiles' && <ViewGamesTiles />}
        {gamesView === 'list' && <ViewGamesList />}
      </Wrapper>
    </Flex>
  );
}

function ViewGamesTiles(): JSX.Element {
  const rating = useSelector((state: any) => state.rating);
  const searchGame = useSelector((state: any) => state.search.game);
  const showGamesRated = useSelector((state: any) => state.showGamesRated);
  const games = useSelector((state: any) => {
    const filteredGames = state.games.list.filter(
      (game: any) => game.curated || game.protected,
    );
    return orderBy(
      filteredGames,
      ['rating', game => game.title.toLowerCase()],
      ['desc', 'asc'],
    );
  });

  return (
    <>
      {games && games.length ? (
        games.map((game: any) => {
          return game?.title.toLowerCase().indexOf(searchGame.toLowerCase()) !==
            -1 &&
            showGamesRated.find(
              (score: any) => parseInt(score, 10) === parseInt(game.rating, 10),
            ) ? (
            <Game key={`id-game-${game.id}`} id={game.id} rating={rating} />
          ) : null;
        })
      ) : (
        <Spinner />
      )}
    </>
  );
}

const GameImg = styled.img.attrs(({ src }: { src: string }) => {
  return {
    src,
  };
})<{ src: string }>`
  height: 32px;
  width: auto;
`;
// function GameImg({ src }: { src: string }) {
//   return <img src={src} alt="avatar" />;
// }

function ViewGamesList(): JSX.Element {
  const games = useSelector((state: any) => {
    const filteredGames = state.games.list.filter(
      (game: any) => game.curated || game.protected,
    );
    return orderBy(
      filteredGames,
      ['rating', game => game.title.toLowerCase()],
      ['desc', 'asc'],
    );
  });
  const gamesColumns = [
    {
      name: 'image',
      label: '-',
      options: {
        // eslint-disable-next-line react/display-name
        customBodyRender: (src: string) => <GameImg src={src} />,
      },
    },
    {
      name: 'title',
      label: 'Title',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'points',
      label: 'Points',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'sale',
      label: 'Sale',
      options: {
        filter: true,
        sort: true,
      },
    },
  ];
  const gamesData = games.map((game: any) => ({
    image: game.img,
    title: game.title,
    points: game.rating,
    sale: game.sale.onSale ? 'yes' : 'no',
  }));
  const gamesOptions = {
    // pagination: false,
    filter: false,
    search: false,
    print: false,
    download: false,
    viewColumns: false,
  };

  return (
    <>
      {games && games.length ? (
        <MUIDataTable
          title="Games"
          data={gamesData}
          columns={gamesColumns}
          options={gamesOptions}
        />
      ) : (
        <Spinner />
      )}
    </>
  );
}
