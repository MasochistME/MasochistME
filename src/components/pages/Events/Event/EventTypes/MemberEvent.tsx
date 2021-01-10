import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  EventDescription,
  EventSummary,
  EventInfo,
  EventImg,
} from 'components/pages/Events/styles';
import { MemberLink } from './styles';
import logo from 'shared/images/logo.png';

type Props = {
  event: any;
  action: 'join' | 'leave';
};

export default function MemberEvent(props: Props): JSX.Element | null {
  const { event, action } = props;
  const history = useHistory();
  const user = useSelector((state: any) =>
    state.users.list.find((u: any) => u.id === event.member),
  );

  const onUserClick = () => user?.id && history.push(`/profile/${user.id}`);

  return (
    <EventInfo>
      <EventImg alt="avatar" src={user?.avatar ?? logo} />
      {user ? (
        <EventDescription>
          <MemberLink className="bold" onClick={onUserClick}>
            {user?.name ?? `User ${event.member}`}
          </MemberLink>{' '}
          has {action === 'join' ? 'joined' : 'left'} the group!
        </EventDescription>
      ) : (
        <EventDescription>
          <MemberLink className="bold" onClick={onUserClick}>
            {user?.name ?? `User ${event.member}`}
          </MemberLink>{' '}
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
