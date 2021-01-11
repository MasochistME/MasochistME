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
};

export default function GameEvent(props: Props): JSX.Element | null {
  const { event } = props;
  const history = useHistory();
  const games = useSelector((state: any) => state.games.list);
  const rating = useSelector((state: any) => state.rating);

  const game = games.find((g: any) => Number(g.id) === Number(event.game));
  const gameRating = rating.find((r: any) =>
    game ? Number(r.id) === Number(game.rating) : null,
  );

  const onGameClick = () => game?.id && history.push(`/game/${game.id}`);

  return (
    <EventInfo>
      <EventImg alt="game-img" src={logo} />
      {game ? (
        <EventDescription>
          <EventLink className="bold" onClick={onGameClick}>
            {game ? game.title : `Game ${event.game}`}
          </EventLink>{' '}
          has been curated!
        </EventDescription>
      ) : (
        <EventDescription>
          <EventLink className="bold" onClick={onGameClick}>
            {game ? game.title : `Game ${event.game}`}
          </EventLink>{' '}
          (no longer curated) has been curated!
        </EventDescription>
      )}

      <EventSummary>
        <i
          className={
            game ? 'fas fa-plus-square' : 'fas fa-exclamation-triangle'
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
