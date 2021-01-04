import React from 'react';
import { useSelector } from 'react-redux';
import logo from 'shared/images/logo.png';

type Props = {
  event: any;
};

export default function CompleteEvent(props: Props): JSX.Element | null {
  const { event } = props;
  const games = useSelector((state: any) => state.games);
  const members = useSelector((state: any) => state.members);
  const rating = useSelector((state: any) => state.rating);

  const game = games.find((g: any) => Number(g.id) === Number(event.game));
  const member = members.find(
    (m: any) => Number(m.id) === Number(event.member),
  );
  const gameRating = rating.find((r: any) =>
    game ? Number(r.id) === Number(game.rating) : null,
  );

  return (
    <div className="event-info flex-row">
      <img
        className="event-img"
        src={member ? member.avatar : logo}
        alt="game-img"></img>
      {member ? (
        game ? ( //member yes
          <div className="event-desc">
            <span className="bold under">
              {member ? member.name : `User ${event.member}`}
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
              {member ? member.name : `User ${event.member}`}
            </span>{' '}
            completed{' '}
            <span className="bold under">
              {game ? game.title : `game ${event.game}`}
            </span>{' '}
            (no longer curated)!
          </div>
        )
      ) : game ? ( //member no
        <div className="event-desc">
          <span className="bold under">
            {member ? member.name : `User ${event.member}`}
          </span>{' '}
          (no longer member of the group) completed{' '}
          <span className="bold under">
            {game ? game.title : `game ${event.game}`}
          </span>
          !
        </div>
      ) : (
        <div className="event-desc">
          <span className="bold under">
            {member ? member.name : `User ${event.member}`}
          </span>{' '}
          (no longer member of the group) completed{' '}
          <span className="bold under">
            {game ? game.title : `game ${event.game}`}
          </span>{' '}
          (no longer curated)!
        </div>
      )}

      <div className="event-summary flex-row">
        <i
          className={
            member ? 'fas fa-check-square' : 'fas fa-exclamation-triangle'
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
