import React from 'react';
import { useSelector } from 'react-redux';
import { orderBy } from 'lodash';

import { useUserDetails } from 'components/init';
import { useUsers } from 'shared/hooks';
import { Spinner } from 'shared/components';
import { Display, DetailsSummary, RatingScore } from './styles';
import UserGame from './UserGame';

type TUserDetails = {
  id: any;
  show: any;
};

UserDetails.Display = Display;
UserDetails.DetailsSummary = DetailsSummary;
UserDetails.RatingScore = RatingScore;

export default function UserDetails(props: TUserDetails): JSX.Element {
  const { id, show } = props;
  const userLoaded = useUserDetails(id);
  const users = useUsers(true);
  const rating = useSelector((state: any) => state.rating);
  const games = useSelector((state: any) => state.games.list);
  const user = useSelector((state: any) => {
    const userBasic = users.find((user: any) => user.id === id);
    const userGames = state.users.details.find((user: any) => user.id === id)
      ?.games;
    const userRanking = state.ranking.find((user: any) => user.id === id);
    return {
      ...userBasic,
      games: userGames,
      ranking: userRanking,
    };
  });

  const composeGameList = () => {
    const userGames = orderBy(
      user.games.map((game: any) => ({
        ...game,
        percentage: typeof game.percentage !== 'number' ? 0 : game.percentage,
      })),
      ['percentage', 'lastUnlocked'],
      ['desc', 'desc'],
    );

    return userGames.map(game => {
      const gameDetails = games.find(
        (g: any) => Number(g.id) === Number(game.id),
      );
      if (!gameDetails) {
        // most likely non-steam game, or deleted one
        return;
      }
      const ratingIcon = rating.find((r: any) => r.id === gameDetails.rating);
      return (
        <UserGame
          key={`game-${game.id}`}
          user={user}
          game={{
            ...game,
            badges: gameDetails.badges,
            title: gameDetails.title,
            rating: ratingIcon ? ratingIcon.icon : 'fas fa-spinner',
            img: gameDetails.img,
          }}
        />
      );
    });
  };

  return userLoaded ? (
    <UserDetails.Display show={show}>{composeGameList()}</UserDetails.Display>
  ) : (
    <Spinner />
  );
}
