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
};

export default function CompleteEvent(props: Props): JSX.Element | null {
  const { event } = props;
  const history = useHistory();
  const game = useSelector((state: any) =>
    state.games.list.find((g: any) => Number(g.id) === Number(event.game)),
  );
  const user = useSelector((state: any) =>
    state.users.list.find((u: any) => u.id === event.member),
  );
  const rating = useSelector((state: any) => state.rating);
  const gameRating = rating.find((r: any) =>
    game ? Number(r.id) === Number(game.rating) : null,
  );

  const onUserClick = () => user?.id && history.push(`/profile/${user.id}`);

  return (
    <EventInfo>
      <EventImg src={user?.avatar ?? logo} alt="game-img" />
      <EventDescription>
        <MemberLink className="bold" onClick={onUserClick}>
          {user?.name ?? `User ${event.member} (no longer member of the group)`}
        </MemberLink>{' '}
        completed{' '}
        <span className="bold">
          {game?.title ?? `game ${event.game} (no longer curated)`}
        </span>{' '}
        !
      </EventDescription>
      <EventSummary>
        <i
          className={
            user ? 'fas fa-check-square' : 'fas fa-exclamation-triangle'
          }></i>
        <i className={gameRating?.icon ?? 'far fa-question-circle'}></i>
        <EventImg src={game?.img ?? logo} alt="game-img" />
      </EventSummary>
    </EventInfo>
  );
}
