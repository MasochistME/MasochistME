import React from 'react';
import { useSelector } from 'react-redux';
import logo from 'shared/images/logo.png';

type Props = {
  event: any;
  action: 'join' | 'leave';
};

export default function MemberEvent(props: Props): JSX.Element | null {
  const { event, action } = props;
  const members = useSelector((state: any) => state.members);
  const member = members.find(
    (m: any) => Number(m.id) === Number(event.member),
  );

  return (
    <div className="event-info flex-row">
      <img
        className="event-img"
        alt="avatar"
        src={member ? member.avatar : logo}></img>
      {member ? (
        <div className="event-desc">
          <span className="bold under">
            {member ? member.name : `User ${event.member}`}
          </span>{' '}
          has {action === 'join' ? 'joined' : 'left'} the group!
        </div>
      ) : (
        <div className="event-desc">
          <span className="bold under">
            {member ? member.name : `User ${event.member}`}
          </span>{' '}
          has {action === 'join' ? 'joined' : 'left'} the group!
        </div>
      )}
      <div className="event-summary flex-row">
        <i
          className={
            member
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
