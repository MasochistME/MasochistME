import {
  EventDescription,
  EventSummary,
  EventInfo,
  EventImg,
} from 'components/pages/Events/styles';
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
  const games = useSelector((state: any) => state.games.list);
  const game = games.find((g: any) => Number(g.id) === Number(event.game));

  return game && rating ? (
    <EventInfo>
      <EventImg alt="game-img" src={logo} />
      <EventDescription>
        <span className="bold under">{game ? game.title : '-'} </span>
        {event.oldNumber < event.newNumber
          ? `got ${event.newNumber - event.oldNumber} new achievements!`
          : `had ${event.oldNumber - event.newNumber} achievements removed!`}
      </EventDescription>
      <EventSummary>
        <i
          className={game ? 'fas fa-tasks' : 'fas fa-exclamation-triangle'}></i>
        <i className={rating ? rating.icon : 'far fa-question-circle'}></i>
        <EventImg alt="game-img" src={game ? game.img : logo} />
      </EventSummary>
    </EventInfo>
  ) : null;
}
