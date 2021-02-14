/* eslint-disable react/display-name */
import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { orderBy } from 'lodash';
import { Spinner, Wrapper, Table } from 'shared/components';
import { TableLink, defaultSort } from 'shared/components/layout/Table';

const GameImg = styled.img.attrs(({ src }: { src: string }) => {
  return {
    src,
  };
})<{ src: string }>`
  height: 48px;
  width: auto;
`;

type GameData = {
  id: any;
  image: string;
  title: string;
  points: string;
  completions: number;
  avgplaytime: number;
  badgesnr: number;
  achievementsnr: number;
  sale: 'yes' | 'no';
};

export default function ViewGamesList(): JSX.Element {
  const history = useHistory();
  const inView = useSelector((state: any) => state.games.view === 'list');
  const searchGame = useSelector((state: any) => state.search.game);
  const showGamesRated = useSelector((state: any) => state.showGamesRated);
  const games = useSelector((state: any) => {
    const filteredGames = state.games.list.filter(
      (game: any) =>
        (game.curated || game.protected) &&
        game?.title.toLowerCase().includes(searchGame.toLowerCase()) &&
        showGamesRated.find(
          (score: any) => Number(score) === Number(game.rating),
        ),
    );
    return orderBy(
      filteredGames,
      ['rating', game => game.title.toLowerCase()],
      ['desc', 'asc'],
    );
  });
  const onGameClick = (game: GameData) =>
    game?.id && history.push(`/game/${game.id}`);

  const gamesColumns = [
    {
      render: (game: GameData) => <GameImg src={game.image} />,
    },
    {
      title: 'Title',
      width: '30%',
      render: (game: GameData) => (
        <TableLink className="bold" onClick={() => onGameClick(game)}>
          {game.title}
        </TableLink>
      ),
      sorter: (a: GameData, b: GameData) => defaultSort(a.title, b.title),
    },
    {
      title: 'Points',
      render: (game: GameData) => <div>{game.points}</div>,
      sorter: (a: GameData, b: GameData) => defaultSort(a.points, b.points),
    },
    {
      title: 'Completions',
      render: (game: GameData) => <div>{game.completions}</div>,
      sorter: (a: GameData, b: GameData) =>
        defaultSort(a.completions, b.completions),
    },
    {
      title: 'Avg playtime',
      render: (game: GameData) => <div>{`${game.avgplaytime} h`}</div>,
      sorter: (a: GameData, b: GameData) =>
        defaultSort(a.avgplaytime, b.avgplaytime),
    },
    {
      title: 'Badges',
      render: (game: GameData) => <div>{game.badgesnr}</div>,
      sorter: (a: GameData, b: GameData) => defaultSort(a.badgesnr, b.badgesnr),
    },
    {
      title: 'Achievements',
      render: (game: GameData) => <div>{game.achievementsnr}</div>,
      sorter: (a: GameData, b: GameData) =>
        defaultSort(a.achievementsnr, b.achievementsnr),
    },
    {
      title: 'Sale',
      render: (game: GameData) => <div>{game.sale}</div>,
      sorter: (a: GameData, b: GameData) => defaultSort(a.sale, b.sale),
    },
  ];

  const gamesData: GameData[] = games.map((game: any) => ({
    id: game.id,
    image: game.img,
    title: game.title,
    points: game.rating,
    completions: game.stats.completions,
    avgplaytime: Math.round(game.stats.avgPlaytime),
    badgesnr: game.stats.badgesNr,
    achievementsnr: game.stats.achievementsNr,
    sale: game.sale.onSale ? 'yes' : 'no',
  }));

  return (
    <Wrapper type="page" style={{ display: inView ? 'flex' : 'none' }}>
      {games && games.length ? (
        <Table
          dataSource={gamesData}
          // @ts-ignore
          columns={gamesColumns}
          showSorterTooltip={false}
          pagination={{
            pageSize: 20,
            defaultPageSize: 20,
            hideOnSinglePage: true,
            showQuickJumper: false,
            showLessItems: true,
            showSizeChanger: false,
          }}
        />
      ) : (
        <Spinner />
      )}
    </Wrapper>
  );
}
