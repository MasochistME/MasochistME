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
  action: 'added' | 'removed';
};

export default function GameEvent(props: Props): JSX.Element | null {
  const { event, action } = props;
  const history = useHistory();
  const games = useSelector((state: any) => state.games.list);
  const rating = useSelector((state: any) => state.rating);

  const game = games.find((g: any) => Number(g.id) === Number(event.game));
  const gameRating = rating.find((r: any) =>
    game ? Number(r.id) === Number(game.rating) : null,
  );

  const onGameClick = () =>
    action === 'added' && game?.id && history.push(`/game/${game.id}`);

  return (
    <EventInfo>
      <EventImg alt="game-img" src={logo} />
      {game ? (
        <EventDescription>
          <EventLink className="bold" onClick={onGameClick}>
            {game ? game.title : `Game ${event.game}`}
          </EventLink>{' '}
          {action === 'added'
            ? 'has been curated!'
            : 'has been removed from curator!'}
        </EventDescription>
      ) : (
        <EventDescription>
          <EventLink className="bold" onClick={onGameClick}>
            {game ? game.title : `Game ${event.game}`}
          </EventLink>{' '}
          (no longer curated) has been{' '}
          {action === 'added' ? 'curated!' : 'removed from curator!'}
        </EventDescription>
      )}

      <EventSummary>
        <i
          className={
            game
              ? `fas fa-${action === 'added' ? 'plus' : 'minus'}-square`
              : 'fas fa-exclamation-triangle'
          }></i>
        <i
          className={
            gameRating ? gameRating.icon : 'far fa-question-circle'
          }></i>
        <EventImg alt="game-img" src={game ? game.img : logo} />
      </EventSummary>
    </EventInfo>
  );
}
