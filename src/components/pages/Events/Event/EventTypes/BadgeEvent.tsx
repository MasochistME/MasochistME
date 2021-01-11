import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  EventDescription,
  EventSummary,
  EventInfo,
  EventImg,
  EventLink,
} from 'components/pages/Events/styles';
import logo from 'shared/images/logo.png';

type Props = {
  event: any;
  action: 'added' | 'given';
};

export default function BadgeEvent(props: Props): JSX.Element | null {
  const { event, action } = props;
  if (action === 'added') {
    return <BadgeAdded event={event} />;
  }
  if (action === 'given') {
    return <BadgeGiven event={event} />;
  }
  return null;
}

// ----------------------------------------------
// ----------------------------------------------
// ----------------------------------------------

function BadgeAdded({ event }: { event: any }) {
  const badge = useSelector((state: any) =>
    state.badges.find((b: any) => b['_id'] === event.badge),
  );
  const game = useSelector((state: any) =>
    state.games.list.find((g: any) => Number(g.id) === Number(event.game)),
  );

  return (
    <EventInfo>
      <EventImg src={badge ? badge.img : logo} alt="game-img" />
      {badge && game ? (
        <EventDescription>
          <span className="bold">
            {game?.title ? game.title : `Game ${event.game}`}
          </span>{' '}
          has gotten a new badge -{' '}
          <span className="bold">{badge?.name ? badge.name : event.badge}</span>
          !
        </EventDescription>
      ) : null}
      <EventSummary>
        <i className="fas fa-award"></i>
        <EventImg src={game ? game.img : logo} alt="game-img" />
      </EventSummary>
    </EventInfo>
  );
}

// ----------------------------------------------
// ----------------------------------------------
// ----------------------------------------------

function BadgeGiven({ event }: { event: any }) {
  const history = useHistory();
  const user = useSelector((state: any) =>
    state.users.list.find((u: any) => u.id === event.member),
  );
  const badge = useSelector((state: any) =>
    state.badges.find((b: any) => b['_id'] === event.badge),
  );

  const onUserClick = () => user?.id && history.push(`/profile/${user.id}`);

  return (
    <EventInfo>
      <EventImg src={user?.avatar ?? logo} alt="game-img" />
      {badge && user ? (
        <EventDescription>
          <EventLink className="bold" onClick={onUserClick}>
            {user?.name ?? `User ${event.member}`}
          </EventLink>{' '}
          has earned a new badge -{' '}
          <span className="bold">{badge?.name ?? event.badge}</span>!
        </EventDescription>
      ) : null}
      <EventSummary>
        <i
          className={
            user ? 'fas fa-check-square' : 'fas fa-exclamation-triangle'
          }></i>
        <i className="fas fa-medal"></i>
        <EventImg src={badge ? badge.img : logo} alt="game-img" />
      </EventSummary>
    </EventInfo>
  );
}
