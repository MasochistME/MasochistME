import React from 'react';
import { useSelector } from 'react-redux';
import { orderBy } from 'lodash';
import styled from 'styled-components';
import moment from 'moment';
import { log } from 'shared/helpers';
import DoughnutChart from 'components/Charts/DoughnutChart';
import LineChart from 'components/Charts/LineChart';
import ChartWrapper from 'components/Charts/ChartWrapper';

const GraphsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
`;

type Rating = {
  sum: number;
  label: string;
  id: string;
};

type Props = {
  user: any;
};

export default function ProfileGraphs(props: Props): JSX.Element {
  const { user } = props;
  const games = useSelector((state: any) => state.games.list);
  const rating = useSelector((state: any) => state.rating);

  const summarizeTotalTimes = (
    type: any,
    scope: any,
    rating: any,
    user: any,
    games: any,
  ) => {
    const data: Rating[] = [];

    let userGames = user?.games;

    rating.map((r: any) =>
      data.push({
        sum: 0,
        label: r.symbol,
        id: r.id,
      }),
    );

    if (scope === 'completed') {
      userGames = userGames.filter((game: any) => game.percentage === 100);
    }

    userGames
      .filter((game: any) => games.find((g: any) => parseInt(g.id) === game.id))
      .map((game: any) => {
        game = {
          ...game,
          rating: games.find((g: any) => parseInt(g.id) === game.id).rating,
        };
        const index = data.findIndex((d: any) => d.id === game.rating);
        data[index].sum += game.playtime;
        return game;
      });

    return data.map((d: any) =>
      typeof d[type] === 'number' ? Math.floor(d[type]) : d[type],
    );
  };

  const summarizeTotalGames = (
    type: any,
    rating: any,
    user: any,
    games: any,
  ) => {
    const data: any = [];

    rating.map((r: any) =>
      data.push({
        sum: 0,
        label: r.symbol,
        id: r.id,
      }),
    );

    user?.games
      .filter(
        (game: any) =>
          game.percentage === 100 &&
          games.find((g: any) => parseInt(g.id) === game.id),
      )
      .map((game: any) => {
        game = {
          ...game,
          rating: games.find((g: any) => parseInt(g.id) === game.id).rating,
        };
        const index = data.findIndex((d: any) => d.id === game.rating);
        data[index].sum += 1;
        return game;
      });
    return data.map((d: any) => d[type]);
  };

  const getTimelines = (type: any, rating: any, user: any, games: any) => {
    let data = [];
    let gamesTotal = 0;
    let pointsTotal = 0;
    let startDate = 0;
    let endDate = 0;

    let timelines = user?.games.filter((game: any) => game.percentage === 100);
    timelines = orderBy(timelines, ['lastUnlocked'], ['asc']);

    // @ts-ignore
    startDate = moment(new Date(timelines[0].lastUnlocked * 1000));
    // @ts-ignore
    endDate = moment(
      new Date(timelines[timelines.length - 1].lastUnlocked * 1000),
    );

    // @ts-ignore
    while (startDate.isBefore(endDate)) {
      data.push({
        // @ts-ignore: any
        label: startDate.format('YYYY-MM'),
        games: 0,
        points: 0,
      });
      // @ts-ignore: any
      startDate.add(1, 'month');
    }

    data = data.map((date: any) => {
      const gamesCompletedInMonth = timelines
        .filter((game: any) => {
          const month = new Date(game.lastUnlocked * 1000).getMonth() + 1;
          const year = new Date(game.lastUnlocked * 1000).getFullYear();
          return (
            date.label === `${year}-${month < 10 ? `0${month}` : month}` &&
            games.find((g: any) => parseInt(g.id) === game.id)
          );
        })
        .map((game: any) => {
          try {
            date.points += rating.find(
              (r: any) =>
                r.id ===
                games.find((g: any) => parseInt(g.id) === game.id).rating,
            ).score;
          } catch (err) {
            log.WARN(err);
            date.points = 0;
          }
          return game;
        });
      if (gamesCompletedInMonth.length !== 0) {
        gamesTotal = gamesTotal + gamesCompletedInMonth.length;
        pointsTotal = pointsTotal + date.points;
      }
      date.games = gamesTotal;
      date.points = pointsTotal;
      return date;
    });

    return data.map((d: any) => d[type]);
  };

  return (
    <GraphsWrapper>
      <ChartWrapper title="HOURS PLAYED (TOTAL)">
        <DoughnutChart
          labels={summarizeTotalTimes('label', 'total', rating, user, games)}
          dataset={summarizeTotalTimes('sum', 'total', rating, user, games)}
        />
      </ChartWrapper>
      <ChartWrapper title="HOURS PLAYED (COMPLETED)">
        <DoughnutChart
          labels={summarizeTotalTimes(
            'label',
            'completed',
            rating,
            user,
            games,
          )}
          dataset={summarizeTotalTimes('sum', 'completed', rating, user, games)}
        />
      </ChartWrapper>
      <ChartWrapper title="GAMES COMPLETED">
        <DoughnutChart
          labels={summarizeTotalGames('label', rating, user, games)}
          dataset={summarizeTotalGames('sum', rating, user, games)}
        />
      </ChartWrapper>
      <ChartWrapper title="COMPLETION TIMELINE" width="100%">
        <LineChart
          labels={getTimelines('label', rating, user, games)}
          datasets={[
            {
              label: 'games',
              data: getTimelines('games', rating, user, games),
            },
            {
              label: 'points',
              data: getTimelines('points', rating, user, games),
            },
          ]}
        />
      </ChartWrapper>
    </GraphsWrapper>
  );
}
