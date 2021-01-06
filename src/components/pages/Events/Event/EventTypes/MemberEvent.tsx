import React from 'react';
import { useSelector } from 'react-redux';
import logo from 'shared/images/logo.png';

type Props = {
  event: any;
  action: 'join' | 'leave';
};

export default function MemberEvent(props: Props): JSX.Element | null {
  const { event, action } = props;
  const users = useSelector((state: any) => state.users);
  const user = users.find((m: any) => Number(m.id) === Number(event.user));

  return (
    <div className="event-info flex-row">
      <img
        className="event-img"
        alt="avatar"
        src={user ? user.avatar : logo}></img>
      {user ? (
        <div className="event-desc">
          <span className="bold under">
            {user ? user.name : `User ${event.user}`}
          </span>{' '}
          has {action === 'join' ? 'joined' : 'left'} the group!
        </div>
      ) : (
        <div className="event-desc">
          <span className="bold under">
            {user ? user.name : `User ${event.user}`}
          </span>{' '}
          has {action === 'join' ? 'joined' : 'left'} the group!
        </div>
      )}
      <div className="event-summary flex-row">
        <i
          className={
            user
              ? action === 'join'
                ? 'fas fa-user-plus'
                : 'fas fa-user-minus'
              : 'fas fa-exclamation-triangle'
          }></i>
        <img className="event-img" alt="game-img" src={logo}></img>
      </div>
    </div>
  );
}
