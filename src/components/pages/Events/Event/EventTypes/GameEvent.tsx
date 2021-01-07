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

export default function GameEvent(props: Props): JSX.Element | null {
  const { event } = props;
  const games = useSelector((state: any) => state.games);
  const rating = useSelector((state: any) => state.rating);

  const game = games.find(
    (g: any) => Number(g.id) === Number(props.event.game),
  );
  const gameRating = rating.find((r: any) =>
    game ? Number(r.id) === Number(game.rating) : null,
  );

  return (
    <EventInfo>
      <EventImg alt="game-img" src={logo} />
      {game ? (
        <EventDescription>
          <span className="bold under">
            {game ? game.title : `Game ${event.game}`}
          </span>{' '}
          has been curated!
        </EventDescription>
      ) : (
        <EventDescription>
          <span className="bold under">
            {game ? game.title : `Game ${event.game}`}
          </span>{' '}
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
