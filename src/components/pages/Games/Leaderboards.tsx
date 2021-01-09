import React from 'react';
import { useSelector } from 'react-redux';
import LeaderboardsProgressBar from './LeaderboardsProgressBar';
import StackedBarChart from 'components/Charts/StackedBarChart';
import ChartWrapper from 'components/Charts/ChartWrapper';
import { Flex, Spinner } from 'shared/components';
import { useGameDetails } from 'components/init';

type Props = {
  id: any;
  rating: any;
};

export default function Leaderboards(props: Props): JSX.Element | null {
  const { id } = props;
  const loaded = useGameDetails(id);
  const users = useSelector((state: any) => state.users.list);
  const game = useSelector((state: any) => {
    const gameBasic = state.games.list.find((g: any) => g.id === id);
    const gameDetails = state.games.details.find((g: any) => g.id === id);
    return {
      ...gameBasic,
      ...gameDetails,
    };
  });

  const leaderboards = game?.players
    ? game.players.map((player: any) => {
        const user = users.find((u: any) => u.id === player.id);
        return {
          id: player.id,
          name: user.name,
          avatar: user.avatar,
          gameId: game.id,
          percentage: player.percentage,
          lastUnlocked: player.lastUnlocked,
          playtime: player.playtime,
        };
      })
    : [];

  const assignDateIfFinished = (leaderboards: any): string | null => {
    return leaderboards?.percentage === 100
      ? new Date(leaderboards?.lastUnlocked * 1000).toLocaleString()
      : null;
  };

  return loaded && game ? (
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
            `Completions: ${game.completions}`,
            'Average completion time',
          ]}>
          <StackedBarChart
            labels={['hours']}
            datasets={[
              {
                label: 'this game',
                data: [game.avgPlaytime],
                colorNormal: '#e30000ff',
                colorTransparent: '#e3000033',
              },
              {
                label: 'games from this tier',
                data: [game.avgPlaytime], // TODO
                colorNormal: '#141620ff',
                colorTransparent: '#14162066',
              },
            ]}
          />
        </ChartWrapper>
      </div>
      {game.badges.length > 0 ? (
        <div className="game-badges">
          <div className="profile-section flex-column">
            <h3 className="profile-section-title">Badges</h3>
            <Flex
              column
              style={{
                width: '100%',
                height: '100%',
                padding: '0 10px 10px 10px',
                boxSizing: 'border-box',
              }}>
              {game.badges.map((badge: any, index: number) => (
                <div
                  className="badge-description flex-column"
                  key={`badge-${index}`}>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>
                    {badge.name.toUpperCase()}
                  </p>
                  <Flex row style={{ width: '100%' }}>
                    <img
                      className="profile-badge"
                      style={{ margin: '5px 10px 5px 5px' }}
                      src={badge.img}
                      alt="badge"
                      key={`badge-${index}`}
                    />
                    <Flex column style={{ width: '100%' }}>
                      <p className="badge-field">Points: {badge.points} pts</p>
                      <p className="badge-field">Proof: {badge.requirements}</p>
                      <p className="badge-field">
                        Description: {badge.description}
                      </p>
                    </Flex>
                  </Flex>
                </div>
              ))}
            </Flex>
          </div>
        </div>
      ) : null}
      <ul className="game-leaderboards">
        {leaderboards.map((user: any, userIndex: number) => (
          <li
            className="leaderboards-user flex-row"
            key={`leaderboards-user-${userIndex}`}>
            <img
              className="leaderboards-user-image"
              alt="avatar"
              src={user.avatar}></img>
            <div className="leaderboards-user-info flex-row">
              <div className="leaderboards-user-name">
                {game.trophy + user.name}
              </div>
              <div className="leaderboards-user-times">
                {assignDateIfFinished(user)}
              </div>
            </div>
            <LeaderboardsProgressBar percentage={Math.floor(user.percentage)} />
          </li>
        ))}
      </ul>
    </div>
  ) : (
    <Spinner />
  );
}
