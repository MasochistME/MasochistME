import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { ProgressBar } from 'shared/components';
import { User, Link, UserInfo, UserName, UserTimes } from './styles';
// import UserBadges from './UserBadges';

const LeaderboardsList = styled.ul`
  width: 100%;
  list-style-type: none;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
`;

List.User = User;
List.Link = Link;
List.UserInfo = UserInfo;
List.UserName = UserName;
List.UserTimes = UserTimes;
// List.UserBadges = UserBadges;
List.ProgressBar = ProgressBar;

export default function List(props: { game: any }): JSX.Element {
  const { game } = props;
  const history = useHistory();
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

  const onUserClick = (id?: string) => id && history.push(`/profile/${id}`);

  return (
    <LeaderboardsList>
      {leaderboards.map((user: any, userIndex: number) => (
        <List.User key={`leaderboards-user-${userIndex}`}>
          <img
            className="leaderboards-user-image"
            alt="avatar"
            src={user.avatar}></img>
          <List.UserInfo>
            <List.UserName>
              {`${user.trophy ? user.trophy : ''}`}
              <List.Link onClick={() => onUserClick(user?.id)}>
                {user.name}
              </List.Link>
            </List.UserName>
            {/* <List.UserBadges user={user} game={game} /> */}
            <List.UserTimes>{assignDateIfFinished(user)}</List.UserTimes>
          </List.UserInfo>
          <List.ProgressBar percentage={Math.floor(user.percentage)} />
        </List.User>
      ))}
    </LeaderboardsList>
  );
}
