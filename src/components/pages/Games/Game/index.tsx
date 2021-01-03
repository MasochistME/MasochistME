import React from 'react';
import { swapRatingToIcon } from '../../../../shared/helpers/helper';
import Leaderboards from '../Leaderboards/index';

export default class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      extended: false,
    };
  }

  extendLeaderboards = event => {
    event.cancelBubble = true;
    this.setState({ extended: !this.state.extended });
  };

  render() {
    const game = this.props.game;
    const rating = this.props.rating;

    return (
      <div
        className={this.state.extended ? 'game-extended' : ''}
        onClick={this.extendLeaderboards}>
        <div
          className={
            this.state.extended
              ? `game rated-${game.rating} display-none`
              : `game rated-${game.rating}`
          }
          style={{ backgroundImage: `url(${game.img})` }}>
          <div className="game-info">
            <div className="game-rating">
              <i
                className={
                  game
                    ? swapRatingToIcon(game.rating, rating)
                    : 'fas fa-spinner'
                }></i>
            </div>
            <div className="game-title">{game.title}</div>
            <div className="game-desc">{game.desc}</div>
          </div>
        </div>
        <Leaderboards
          show={this.state.extended}
          game={game}
          rating={game.rating}
        />
      </div>
    );
  }
}
