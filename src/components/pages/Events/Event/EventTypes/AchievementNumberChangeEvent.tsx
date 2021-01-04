import React from 'react';
import { useSelector } from 'react-redux';
import logo from 'shared/images/logo.png';

type Props = {
  event: any;
};

export default function AchievementNumberChangeEvent(
  props: Props,
): JSX.Element | null {
  const { event } = props;
  const rating = useSelector((state: any) =>
    state.rating.find((r: any) =>
      game ? Number(r.id) === Number(game.rating) : null,
    ),
  );
  const games = useSelector((state: any) => state.games);
  const game = games.find((g: any) => Number(g.id) === Number(event.game));

  return game && rating ? (
    <div className="event-info flex-row">
      <img className="event-img" alt="game-img" src={logo}></img>
      <div className="event-desc">
        <span className="bold under">{game ? game.title : '-'} </span>
        {event.oldNumber < event.newNumber
          ? `got ${event.newNumber - event.oldNumber} new achievements!`
          : `had ${event.oldNumber - event.newNumber} achievements removed!`}
      </div>
      <div className="event-summary flex-row">
        <i
          className={game ? 'fas fa-tasks' : 'fas fa-exclamation-triangle'}></i>
        <i className={rating ? rating.icon : 'far fa-question-circle'}></i>
        <img
          className="event-img"
          alt="game-img"
          src={game ? game.img : logo}></img>
      </div>
    </div>
  ) : null;
}
