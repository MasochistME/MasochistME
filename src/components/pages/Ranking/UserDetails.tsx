import React from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { useUserDetails } from 'components/init';
import { Spinner } from 'shared/components';
import UserGame from './UserGame';

type TUserDetails = {
  id: any;
  show: any;
};

export default function UserDetails(props: TUserDetails): JSX.Element {
  const { id, show } = props;
  const userLoaded = useUserDetails(id);
  const rating = useSelector((state: any) => state.rating);
  // const badges = useSelector((state: any) => state.badges);
  const games = useSelector((state: any) => state.games);
  const user = useSelector((state: any) => {
    const userBasic = state.users.list.find((user: any) => user.id === id);
    const userGames = state.users.details.find((user: any) => user.id === id)
      ?.games;
    const userRanking = state.ranking.find((user: any) => user.id === id);
    return {
      ...userBasic,
      games: userGames,
      ranking: userRanking,
    };
  });

  // const summarizeBadgePoints = (user: any, badges: any) => {
  //   let sum = 0;
  //   user.badges.map((badge: any) => {
  //     const usersBadge = badges.find((b: any) => badge.id === b['_id']); // TODO equality
  //     if (usersBadge) {
  //       if (typeof usersBadge.points !== 'number') {
  //         usersBadge.points = parseInt(usersBadge.points);
  //       }
  //       sum += usersBadge.points;
  //     }
  //   });
  //   return sum;
  // };

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
        <UserGame
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

  return userLoaded ? (
    <div className={classDisplay}>
      {/* <div className="flex-row user-details-summary">
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
      </div> */}
      {composeGameList()}
    </div>
  ) : (
    <Spinner />
  );
}
