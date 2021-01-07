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
};

export default function CompleteEvent(props: Props): JSX.Element | null {
  const { event } = props;
  const game = useSelector((state: any) =>
    state.games.find((g: any) => Number(g.id) === Number(event.game)),
  );
  const user = useSelector((state: any) =>
    state.users.find((u: any) => u.id === event.member),
  );
  const rating = useSelector((state: any) => state.rating);
  const gameRating = rating.find((r: any) =>
    game ? Number(r.id) === Number(game.rating) : null,
  );

  return (
    <EventInfo>
      <EventImg src={user ? user.avatar : logo} alt="game-img" />
      <EventDescription>
        <span className="bold under">
          {user?.name
            ? user.name
            : `User ${event.member} (no longer member of the group)`}
        </span>{' '}
        completed{' '}
        <span className="bold under">
          {game?.title ? game.title : `game ${event.game} (no longer curated)`}
        </span>{' '}
        !
      </EventDescription>
      <EventSummary>
        <i
          className={
            user ? 'fas fa-check-square' : 'fas fa-exclamation-triangle'
          }></i>
        <i
          className={
            gameRating ? gameRating.icon : 'far fa-question-circle'
          }></i>
        <EventImg src={game ? game.img : logo} alt="game-img" />
      </EventSummary>
    </EventInfo>
  );
}
