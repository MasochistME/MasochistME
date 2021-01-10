import React from 'react';
import { useSelector } from 'react-redux';
import { ChartWrapper, StackedBarChart } from 'components/Charts';
import { Flex, Spinner, ProgressBar, Section } from 'shared/components';
import { useGameDetails } from 'components/init';
import {
  Description,
  Field,
  BadgeImg,
  User,
  UserInfo,
  UserName,
  UserTimes,
  WrapperLeaderboards,
} from './styles';

type Props = {
  id: any;
  rating: any;
};

// ---------------------------------------------
// ---------------------------------------------
// ---------------------------------------------

Leaderboards.List = List;

export default function Leaderboards(props: Props): JSX.Element | null {
  const { id } = props;
  const loaded = useGameDetails(id);
  const game = useSelector((state: any) => {
    const gameBasic = state.games.list.find((g: any) => g.id === id);
    const gameDetails = state.games.details.find((g: any) => g.id === id);
    return {
      ...gameBasic,
      ...gameDetails,
    };
  });

  return (
    <WrapperLeaderboards>
      <h2>
        <a
          href={`https://store.steampowered.com/app/${game?.id ?? ''}`}
          target="_blank"
          rel="noopener noreferrer">
          {game?.title ?? 'Loading...'}{' '}
          <i className="fas fa-external-link-alt"></i>
        </a>
      </h2>
      {loaded && game ? (
        <div className="game-statistics">
          <ChartWrapper
            title={[
              `Completions: ${game?.completions ?? 'unknown'}`,
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
                  data: [game?.avgPlaytime ?? 0], // TODO
                  colorNormal: '#141620ff',
                  colorTransparent: '#14162066',
                },
              ]}
            />
          </ChartWrapper>
        </div>
      ) : (
        <Spinner />
      )}
      {loaded && game ? (
        game.badges?.length ? (
          <Badges game={game} />
        ) : null
      ) : (
        <Spinner />
      )}
      {loaded && game ? <Leaderboards.List game={game} /> : <Spinner />}
    </WrapperLeaderboards>
  );
}

// ---------------------------------------------
// ---------------------------------------------
// ---------------------------------------------

List.User = User;
List.UserInfo = UserInfo;
List.UserName = UserName;
List.UserTimes = UserTimes;
List.ProgressBar = ProgressBar;

function List(props: { game: any }) {
  const { game } = props;
  const users = useSelector((state: any) => state.users.list);

  const assignDateIfFinished = (leaderboards: any): string | null =>
    leaderboards?.percentage === 100
      ? new Date(leaderboards?.lastUnlocked * 1000).toLocaleString()
      : null;

  const leaderboards = game?.players
    ? game.players.map((player: any) => {
        const user = users.find((u: any) => u.id === player.id);
        return {
          id: player.id,
          name: user.name,
          avatar: user.avatar,
          gameId: game.id,
          trophy: player.trophy,
          percentage: player.percentage,
          lastUnlocked: player.lastUnlocked,
          playtime: player.playtime,
        };
      })
    : [];

  return (
    <ul className="game-leaderboards">
      {leaderboards.map((user: any, userIndex: number) => (
        <List.User key={`leaderboards-user-${userIndex}`}>
          <img
            className="leaderboards-user-image"
            alt="avatar"
            src={user.avatar}></img>
          <List.UserInfo>
            <List.UserName>{`${user.trophy ? user.trophy : ''} ${
              user.name
            }`}</List.UserName>
            <List.UserTimes>{assignDateIfFinished(user)}</List.UserTimes>
          </List.UserInfo>
          <List.ProgressBar percentage={Math.floor(user.percentage)} />
        </List.User>
      ))}
    </ul>
  );
}

// ---------------------------------------------
// ---------------------------------------------
// ---------------------------------------------

Badges.Img = BadgeImg;
Badges.Field = Field;
Badges.Section = Section;
Badges.Description = Description;

function Badges(props: { game: any }) {
  const { game } = props;
  const badges = useSelector((state: any) =>
    state.badges.filter((badge: any) => game.badges.includes(badge['_id'])),
  );
  return (
    <div className="game-badges">
      <Badges.Section>
        <h3>Badges</h3>
        <Flex
          column
          style={{
            width: '100%',
            height: '100%',
            padding: '0 10px 10px 10px',
            boxSizing: 'border-box',
          }}>
          {badges.map((badge: any, index: number) => (
            <Badges.Description key={`badge-${index}`}>
              <p style={{ margin: 0, fontWeight: 'bold' }}>
                {badge.name?.toUpperCase()}
              </p>
              <Flex row style={{ width: '100%' }}>
                <Badges.Img
                  style={{ margin: '5px 10px 5px 5px' }}
                  src={badge.img}
                  alt="badge"
                  key={`badge-${index}`}
                />
                <Flex column style={{ width: '100%' }}>
                  <Badges.Field>Points: {badge.points} pts</Badges.Field>
                  <Badges.Field>Proof: {badge.requirements}</Badges.Field>
                  <Badges.Field>Description: {badge.description}</Badges.Field>
                </Flex>
              </Flex>
            </Badges.Description>
          ))}
        </Flex>
      </Badges.Section>
    </div>
  );
}
