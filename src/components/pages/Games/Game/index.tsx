import React, { useState } from 'react';
import { swapRatingToIcon } from '../../../../shared/helpers/helper';
import Leaderboards from '../Leaderboards/index';

type TGame = {
  game: any;
  rating: any;
};

export default function Game(props: TGame): JSX.Element {
  const { game, rating } = props;
  const [extended, setExtended] = useState(false);

  const onExtend = (event: any) => {
    event.cancelBubble = true;
    setExtended(!extended);
  };

  return (
    <div className={extended ? 'game-extended' : ''} onClick={onExtend}>
      <div
        className={
          extended
            ? `game rated-${game.rating} display-none`
            : `game rated-${game.rating}`
        }
        style={{ backgroundImage: `url(${game.img})` }}>
        <div className="game-info">
          <div className="game-rating">
            <i
              className={
                game ? swapRatingToIcon(game.rating, rating) : 'fas fa-spinner'
              }></i>
          </div>
          <div className="game-title">{game.title}</div>
          <div className="game-desc">{game.desc}</div>
        </div>
      </div>
      <Leaderboards show={extended} game={game} rating={game.rating} />
    </div>
  );
}
