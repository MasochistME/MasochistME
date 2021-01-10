import React from 'react';
import { useSelector } from 'react-redux';
import {
  EventDescription,
  EventSummary,
  EventInfo,
  EventImg,
} from 'components/pages/Events/styles';
import logo from 'shared/images/logo.png';

type Props = {
  event: any;
  action: 'join' | 'leave';
};

export default function MemberEvent(props: Props): JSX.Element | null {
  const { event, action } = props;
  const user = useSelector((state: any) =>
    state.users.list.find((u: any) => u.id === event.member),
  );

  return (
    <EventInfo>
      <EventImg alt="avatar" src={user?.avatar ? user.avatar : logo} />
      {user ? (
        <EventDescription>
          <span className="bold under">
            {user?.name ? user.name : `User ${event.member}`}
          </span>{' '}
          has {action === 'join' ? 'joined' : 'left'} the group!
        </EventDescription>
      ) : (
        <EventDescription>
          <span className="bold under">
            {user?.name ? user.name : `User ${event.member}`}
          </span>{' '}
          has {action === 'join' ? 'joined' : 'left'} the group!
        </EventDescription>
      )}
      <EventSummary>
        <i
          className={
            user
              ? action === 'join'
                ? 'fas fa-user-plus'
                : 'fas fa-user-minus'
              : 'fas fa-exclamation-triangle'
          }></i>
        <EventImg alt="game-img" src={logo} />
      </EventSummary>
    </EventInfo>
  );
}
