import React from 'react';
import MemberGameProgressBar from '../MemberGameProgressBar';

type TMemberProps = {
  game: any;
};

export default function MemberGame(props: TMemberProps): JSX.Element {
  const { game } = props;
  const percentage = isNaN(Math.floor(game.completionRate))
    ? 0
    : Math.floor(game.completionRate);

  return (
    <div className="m-game flex-row">
      <img className="m-game-logo" src={game.img} alt="logo"></img>
      <div className="m-game-info">
        <div className="flex-row">
          <i className={game.rating} />
          <div className="m-game-title"> {game.title}</div>
        </div>
        <div className="m-game-times flex-column">
          {game.completionRate === 100 ? (
            <div className="m-game-completion-timer">
              {new Date(game.lastUnlocked * 1000).toLocaleString()}
            </div>
          ) : null}
          <div style={{ display: 'none' }}>
            {game.playtime_forever
              ? typeof game.playtime_forever === 'number'
                ? Math.round(game.playtime_forever)
                : Math.round(
                    parseInt(game.playtime_forever.replace(',', ''), 10),
                  )
              : 0}{' '}
            h
          </div>
        </div>
      </div>
      <MemberGameProgressBar percentage={percentage} />
    </div>
  );
}
