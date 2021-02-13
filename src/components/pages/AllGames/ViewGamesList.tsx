import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { orderBy } from 'lodash';
import MUIDataTable from 'mui-datatables';
// import {
//   createMuiTheme,
//   MuiThemeProvider,
//   withStyles,
// } from '@material-ui/core/styles';
import { Spinner, Wrapper } from 'shared/components';

const GameImg = styled.img.attrs(({ src }: { src: string }) => {
  return {
    src,
  };
})<{ src: string }>`
  height: 32px;
  width: auto;
`;

export default function ViewGamesList(): JSX.Element {
  const inView = useSelector((state: any) => state.games.view === 'list');
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
    <Wrapper type="page" style={{ display: inView ? 'flex' : 'none' }}>
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
    </Wrapper>
  );
}
