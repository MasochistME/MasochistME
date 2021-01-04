import React from 'react';
import { useSelector } from 'react-redux';
import { orderBy } from 'lodash';
import LeaderboardsProgressBar from './LeaderboardsProgressBar';
import StackedBarChart from '../../../Charts/StackedBarChart';
import ChartWrapper from '../../../Charts/ChartWrapper';

type Props = {
  show: boolean;
  game: any;
  rating: any;
};

export default function Leaderboards(props: Props): JSX.Element | null {
  const { show: visible, game, rating } = props;
  const members = useSelector((state: any) => state.members);
  const games = useSelector((state: any) => state.games);
  const badges = useSelector((state: any) =>
    orderBy(
      state.badges
        .filter((badge: any) => badge.gameId === game.id)
        .map(
          (badge: any) =>
            (badge = {
              ...badge,
              game: badge.isNonSteamGame
                ? badge.game
                : games.find((game: any) => game.id === badge.gameId).title,
            }),
        ),
      ['points'],
      ['desc'],
    ),
  );

  const leaderboards = orderBy(
    members
      .filter((member: any) => member.member)
      .filter((member: any) =>
        member.games.find((g: any) => Number(g.appid) === Number(game.id)),
      )
      .map((member: any) => {
        const memberGameStats = member.games.find(
          (g: any) => Number(g.appid) === Number(game.id),
        );
        return memberGameStats
          ? {
              id: member.id,
              name: member.name,
              avatar: member.avatar,
              gameId: game.id,
              completionRate: memberGameStats.completionRate
                ? memberGameStats.completionRate
                : 0,
              lastUnlocked: memberGameStats.lastUnlocked,
              playtime: memberGameStats.playtime_forever,
            }
          : null;
      }),
    ['completionRate', 'lastUnlocked'],
    ['desc', 'asc'],
  );

  const assignTrophyIfDeserved = (leaderboards: any, index: number): string => {
    if (leaderboards.completionRate !== 100) {
      return '';
    }
    switch (index) {
      case 0:
        return '🥇';
      case 1:
        return '🥈';
      case 2:
        return '🥉';
      default:
        return '';
    }
  };

  const assignDateIfFinished = (leaderboards: any): string | null => {
    return leaderboards.completionRate === 100
      ? new Date(leaderboards.lastUnlocked * 1000).toLocaleString()
      : null;
  };

  const summarizeCompletions = (leaderboard: any): number => {
    return leaderboard.filter((member: any) => member.completionRate === 100)
      .length;
  };

  const summarizeCompletionTime = (leaderboard: any): number => {
    let sum = 0;
    const completed = leaderboard
      .filter((member: any) => member.completionRate === 100)
      .map((entry: any) => {
        entry.playtime
          ? typeof entry.playtime === 'number'
            ? (sum += entry.playtime * 60)
            : (sum += parseInt(entry.playtime.replace(',', '')) * 60)
          : (sum += 0);
        return entry;
      });
    const average = Math.round(sum / 60 / completed.length);

    return Number.isNaN(average) ? 0 : average;
  };

  const summarizeCompletionTimeAll = (): number => {
    let sum = 0;
    let number = 0;
    const gameIDs = games
      .filter((game: any) => game.rating === rating)
      .map((game: any) => game.id);
    members.map((member: any) => {
      member.games.map((game: any) => {
        if (gameIDs.find((g: any) => g === game.appid)) {
          // TODO equality
          sum = sum + parseInt(game.playtime_forever);
          number = number + 1;
        }
        return game;
      });
      return member;
    });
    if (sum !== 0 && number !== 0) {
      return sum / number;
    } else {
      return 0;
    }
  };

  return visible ? (
    <div className="leaderboards">
      <h2>
        <a
          href={`https://store.steampowered.com/app/${game.id}`}
          target="_blank"
          rel="noopener noreferrer">
          {game.title} <i className="fas fa-external-link-alt"></i>
        </a>
      </h2>
      <div className="game-statistics">
        <ChartWrapper
          title={[
            `Completions: ${summarizeCompletions(leaderboards)}`,
            'Average completion time',
          ]}>
          <StackedBarChart
            labels={['hours']}
            datasets={[
              {
                label: 'this game',
                data: [summarizeCompletionTime(leaderboards)],
                colorNormal: '#e30000ff',
                colorTransparent: '#e3000033',
              },
              {
                label: 'games from this tier',
                data: [summarizeCompletionTimeAll()],
                colorNormal: '#141620ff',
                colorTransparent: '#14162066',
              },
            ]}
          />
        </ChartWrapper>
      </div>
      {badges.length > 0 ? (
        <div className="game-badges">
          <div className="profile-section flex-column">
            <h3 className="profile-section-title">Badges</h3>
            <div
              className="flex-column"
              style={{
                width: '100%',
                height: '100%',
                padding: '0 10px 10px 10px',
                boxSizing: 'border-box',
              }}>
              {badges.map((badge: any, index: number) => (
                <div
                  className="badge-description flex-column"
                  key={`badge-${index}`}>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>
                    {badge.name.toUpperCase()}
                  </p>
                  <div className="flex-row" style={{ width: '100%' }}>
                    <img
                      className="profile-badge"
                      style={{ margin: '5px 10px 5px 5px' }}
                      src={badge.img}
                      alt="badge"
                      key={`badge-${index}`}
                    />
                    <div className="flex-column" style={{ width: '100%' }}>
                      <p className="badge-field">Points: {badge.points} pts</p>
                      <p className="badge-field">Proof: {badge.requirements}</p>
                      <p className="badge-field">
                        Description: {badge.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
      <ul className="game-leaderboards">
        {leaderboards.map((member: any, memberIndex: number) => (
          <li
            className="leaderboards-member flex-row"
            key={`leaderboards-member-${memberIndex}`}>
            <img
              className="leaderboards-member-image"
              alt="avatar"
              src={member.avatar}></img>
            <div className="leaderboards-member-info flex-row">
              <div className="leaderboards-member-name">
                {assignTrophyIfDeserved(member, memberIndex) + member.name}
              </div>
              <div className="leaderboards-member-times">
                {assignDateIfFinished(member)}
              </div>
            </div>
            <LeaderboardsProgressBar
              percentage={Math.floor(member.completionRate)}
            />
          </li>
        ))}
      </ul>
    </div>
  ) : null;
}
