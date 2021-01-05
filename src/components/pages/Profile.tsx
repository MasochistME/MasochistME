import React, { useState, useEffect } from 'react';
import { orderBy } from 'lodash';
import moment from 'moment';
import { useSelector } from 'react-redux';
import axios from 'axios';
import DoughnutChart from '../Charts/DoughnutChart';
import LineChart from '../Charts/LineChart';
import ChartWrapper from '../Charts/ChartWrapper/index';

const summarizeTotalTimes = (
  type: any,
  scope: any,
  rating: any,
  user: any,
  games: any,
) => {
  const data: any = [
    // {
    //     sum: 0,
    //     label: 'Total',
    //     id: 'total'
    // }
  ];
  let userGames = user.games;

  rating.map((r: any) =>
    data.push({
      sum: 0,
      label: r.symbol,
      id: r.id,
    }),
  );

  if (scope === 'completed') {
    userGames = userGames.filter((game: any) => game.completionRate === 100);
  }

  userGames
    .filter((game: any) =>
      games.find((g: any) => parseInt(g.id) === game.appid),
    )
    .map((game: any) => {
      game = {
        ...game,
        rating: games.find((g: any) => parseInt(g.id) === game.appid).rating,
      };
      const index = data.findIndex((d: any) => d.id === game.rating);
      data[index].sum += parseInt(game.playtime_forever);
      return game;
    });

  return data.map((d: any) => d[type]);
};
const summarizeTotalGames = (type: any, rating: any, user: any, games: any) => {
  const data: any = [];

  rating.map((r: any) =>
    data.push({
      sum: 0,
      label: r.symbol,
      id: r.id,
    }),
  );

  user.games
    .filter(
      (game: any) =>
        game.completionRate === 100 &&
        games.find((g: any) => parseInt(g.id) === game.appid),
    )
    .map((game: any) => {
      game = {
        ...game,
        rating: games.find((g: any) => parseInt(g.id) === game.appid).rating,
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

  let timelines = user.games.filter((game: any) => game.completionRate === 100);
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
          games.find((g: any) => parseInt(g.id) === game.appid)
        );
      })
      .map((game: any) => {
        try {
          date.points += rating.find(
            (r: any) =>
              r.id ===
              games.find((g: any) => parseInt(g.id) === game.appid).rating,
          ).score;
        } catch (err) {
          console.log(err);
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

export default function Profile(): JSX.Element {
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');

  const members = useSelector((state: any) => state.members);
  const patrons = useSelector((state: any) => state.patrons);
  const badges = useSelector((state: any) =>
    orderBy(
      state.badges
        .filter((badge: any) =>
          user.badges.find((b: any) => b.id === badge._id),
        )
        .map(
          (badge: any) =>
            (badge = {
              ...badge,
              game: badge.isNonSteamGame
                ? badge.game
                : games.find((game: any) => game.id === badge.gameId)
                ? games.find((game: any) => game.id === badge.gameId).title
                : 'unknown',
            }),
        ),
      ['points'],
      ['desc'],
    ),
  );
  const games = useSelector((state: any) => state.games);
  const rating = useSelector((state: any) => state.rating);
  const id = useSelector((state: any) => state.profileID);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sendUpdateRequest = (id: any) => {
    setUpdating(true);
    setMessage('Updating... refresh in a few minutes');

    const url = `/rest/users/user/${id}`;
    axios
      .put(url)
      .then(res => {
        if (res.data) {
          setMessage(res.data);
        }
      })
      .catch(err => console.log(err));
  };

  const user = members.find((member: any) => member.id === id);
  const patron = patrons.find((tier: any) =>
    tier.list.find((p: any) => p.steamid === user.id)
      ? { tier: tier.tier, description: tier.description }
      : false,
  );

  return (
    <div className="flex-column">
      <div className="wrapper-description">
        <div
          className="page-description"
          style={{ paddingBottom: '0', marginBottom: '0' }}>
          <div className="flex-row">
            <h1 style={{ margin: '0' }}>
              <a
                href={`https://steamcommunity.com/profiles/${user.id}`}
                target="_blank"
                rel="noopener noreferrer">
                <i className="fab fa-steam" style={{ marginRight: '10px' }} />
                {user.name}
              </a>
            </h1>
            {patron ? (
              <div
                className="profile-patron"
                title={`This user is a tier ${patron.description.toUpperCase()} supporter`}>
                <i className="fas fa-medal" />{' '}
                {patron.description.toUpperCase()}{' '}
              </div>
            ) : (
              ''
            )}
          </div>
          <div
            className="profile-date flex-row"
            style={{ marginBottom: '5px' }}>
            {
              <span>{`Last updated: ${
                user.updated === 0
                  ? 'never'
                  : new Date(user.updated).toLocaleString()
              }`}</span>
            }
            {Date.now() - user.updated > 3600000 ? (
              updating ? (
                <span
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '40px',
                  }}>
                  {message}
                </span>
              ) : (
                <button
                  className="custom-button"
                  onClick={() => sendUpdateRequest(user.id)}>
                  Update
                </button>
              )
            ) : (
              <button
                className="custom-button button-blocked"
                title={`${Number(
                  (3600000 - (Date.now() - user.updated)) / 60000,
                )} minutes till you can update again`}>
                Update
              </button>
            )}
          </div>
          <div className="profile-basic flex-row">
            <img
              src={user.avatar}
              className={`profile-avatar ${patron ? `tier${patron.tier}` : ''}`}
              alt="avatar"
            />
            <div>Currently there&lsquo;s no info provided about this user.</div>
          </div>
        </div>
      </div>
      <div className="wrapper-profile flex-column">
        {badges.length !== 0 ? (
          <div className="profile-badges">
            <div className="profile-section" style={{ width: '100%' }}>
              <h3 className="profile-section-title">Badges</h3>
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  flexFlow: 'row wrap',
                  justifyContent: 'center',
                }}>
                {badges.map((badge, index) => (
                  <img
                    className="profile-badge"
                    src={badge.img}
                    alt="badge"
                    title={`${badge.game.toUpperCase()} - ${badge.name} (${
                      badge.points
                    } pts)\n"${badge.description}"`}
                    key={`badge-${index}`}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : null}
        {!isNaN(user.points) && user.points !== 0 ? (
          <div className="profile-graphs">
            <ChartWrapper title="HOURS PLAYED (TOTAL)">
              <DoughnutChart
                labels={summarizeTotalTimes(
                  'label',
                  'total',
                  rating,
                  user,
                  games,
                )}
                dataset={summarizeTotalTimes(
                  'sum',
                  'total',
                  rating,
                  user,
                  games,
                )}
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
                dataset={summarizeTotalTimes(
                  'sum',
                  'completed',
                  rating,
                  user,
                  games,
                )}
              />
            </ChartWrapper>
            <ChartWrapper title="GAMES COMPLETED">
              <DoughnutChart
                labels={summarizeTotalGames('label', rating, user, games)}
                dataset={summarizeTotalGames('sum', rating, user, games)}
              />
            </ChartWrapper>
            <ChartWrapper title="COMPLETION TIMELINE" width={100}>
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
          </div>
        ) : null}
      </div>
    </div>
  );
}
