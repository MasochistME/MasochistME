import React from 'react';
import { useSelector } from 'react-redux';
import logo from 'shared/images/logo.png';

type Props = {
  event: any;
};

export default function CompleteEvent(props: Props): JSX.Element | null {
  const { event } = props;
  const games = useSelector((state: any) => state.games);
  const users = useSelector((state: any) => state.users);
  const rating = useSelector((state: any) => state.rating);

  const game = games.find((g: any) => Number(g.id) === Number(event.game));
  const user = users.find(
    (m: any) => Number(m.id) === Number(event.user),
  );
  const gameRating = rating.find((r: any) =>
    game ? Number(r.id) === Number(game.rating) : null,
  );

  return (
    <div className="event-info flex-row">
      <img
        className="event-img"
        src={user ? user.avatar : logo}
        alt="game-img"></img>
      {user ? (
        game ? ( //user yes
          <div className="event-desc">
            <span className="bold under">
              {user ? user.name : `User ${event.user}`}
            </span>{' '}
            completed{' '}
            <span className="bold under">
              {game ? game.title : `game ${event.game}`}
            </span>
            !
          </div>
        ) : (
          <div className="event-desc">
            <span className="bold under">
              {user ? user.name : `User ${event.user}`}
            </span>{' '}
            completed{' '}
            <span className="bold under">
              {game ? game.title : `game ${event.game}`}
            </span>{' '}
            (no longer curated)!
          </div>
        )
      ) : game ? ( //user no
        <div className="event-desc">
          <span className="bold under">
            {user ? user.name : `User ${event.user}`}
          </span>{' '}
          (no longer user of the group) completed{' '}
          <span className="bold under">
            {game ? game.title : `game ${event.game}`}
          </span>
          !
        </div>
      ) : (
        <div className="event-desc">
          <span className="bold under">
            {user ? user.name : `User ${event.user}`}
          </span>{' '}
          (no longer user of the group) completed{' '}
          <span className="bold under">
            {game ? game.title : `game ${event.game}`}
          </span>{' '}
          (no longer curated)!
        </div>
      )}

      <div className="event-summary flex-row">
        <i
          className={
            user ? 'fas fa-check-square' : 'fas fa-exclamation-triangle'
          }></i>
        <i
          className={
            gameRating ? gameRating.icon : 'far fa-question-circle'
          }></i>
        <img
          className="event-img"
          src={game ? game.img : logo}
          alt="game-img"></img>
      </div>
    </div>
  );
}
