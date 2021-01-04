import React from 'react';
import { useSelector } from 'react-redux';
import { swapRatingToIcon } from 'shared/helpers/helper';
import logo from 'shared/images/logo.png';

type Props = { event: any };

export default function TierChangeEvent(props: Props): JSX.Element | null {
  const { event } = props;
  const games = useSelector((state: any) => state.games);
  const rating = useSelector((state: any) => state.rating);

  const game = games.find(
    (g: any) => Number(g.id) === Number(props.event.game),
  );
  const gameRating = rating.find((r: any) =>
    game ? Number(r.id) === Number(game.rating) : null,
  );
  const demoted = Number(props.event.oldTier) > Number(props.event.newTier);

  return game && gameRating ? (
    <div className="event-info flex-row">
      <img className="event-img" alt="game-img" src={logo}></img>
      <div className="event-desc">
        <span className="bold under">{game ? game.title : '-'}</span>
        {demoted ? ' demoted ' : ' promoted '}
        from <i
          className={swapRatingToIcon(event.oldTier, gameRating)}></i> to{' '}
        <i className={swapRatingToIcon(event.newTier, gameRating)}></i>!
      </div>
      <div className="event-summary flex-row">
        {demoted ? (
          <i
            className={
              game ? 'fas fa-caret-square-down' : 'fas fa-exclamation-triangle'
            }></i>
        ) : (
          <i
            className={
              game ? 'fas fa-caret-square-up' : 'fas fa-exclamation-triangle'
            }></i>
        )}
        <i
          className={
            gameRating ? gameRating.icon : 'far fa-question-circle'
          }></i>
        <img
          className="event-img"
          alt="game-img"
          src={game ? game.img : logo}></img>
      </div>
    </div>
  ) : null;
}
