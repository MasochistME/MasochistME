import React from 'react';
import _ from 'lodash';
import MemberGame from '../MemberGame';

type TMemberDetails = {
  user: any;
  show: any;
  rating: any;
  badges: any;
  games: any;
};

export default function MemberDetails(props: TMemberDetails): JSX.Element {
  const { user, show, rating, badges, games } = props;

  const summarizeBadgePoints = (user: any, badges: any) => {
    let sum = 0;
    user.badges.map((badge: any) => {
      const usersBadge = badges.find((b: any) => badge.id === b['_id']); // TODO equality
      if (usersBadge) {
        if (typeof usersBadge.points !== 'number') {
          usersBadge.points = parseInt(usersBadge.points);
        }
        sum += usersBadge.points;
      }
    });
    return sum;
  };

  const classDisplay = show
    ? 'user-details flex-column user-details-visible'
    : 'user-details flex-column user-details-hidden';

  const composeGameList = () => {
    user.games = user.games.map((game: any) => {
      game.completionRate = isNaN(game.completionRate)
        ? 0
        : game.completionRate;
      return game;
    });
    const userGames = _.orderBy(
      user.games,
      ['completionRate', 'lastUnlocked'],
      ['desc', 'desc'],
    );
    return userGames.map(game => {
      let gameDetails = games.find(
        (g: any) => Number(g.id) === Number(game.appid),
      );
      if (!gameDetails) {
        gameDetails = {
          title: 'unknown',
          rating: 'unknown',
          img: 'unknown',
          playtime_forever: 0,
        };
      }
      const ratingIcon = rating.find((r: any) => r.id === gameDetails.rating);
      return (
        <MemberGame
          key={`game-${game.appid}`}
          game={{
            ...game,
            title: gameDetails.title,
            rating: ratingIcon ? ratingIcon.icon : 'fas fa-spinner',
            img: gameDetails.img,
          }}
        />
      );
    });
  };

  return (
    <div className={classDisplay}>
      <div className="flex-row user-details-summary">
        <div className="user-rating-score" title="Sum of all points">
          {user.points ? user.points : 0}
          <span className="bold"> Σ</span>
        </div>
        {rating.map((score: any, scoreIndex: number) => {
          return (
            <div
              className="user-rating-score"
              key={`user-rating-score-${scoreIndex}`}>
              {user.ranking[score.id] !== undefined
                ? user.ranking[score.id]
                : 0}
              <i className={score.icon} style={{ paddingRight: '5px' }} />
            </div>
          );
        })}
        <div className="user-rating-score" title="Sum of points for badges">
          {summarizeBadgePoints(user, badges)}
          <i className="fas fa-medal" style={{ paddingRight: '5px' }} />
        </div>
      </div>
      {composeGameList()}
    </div>
  );
}
