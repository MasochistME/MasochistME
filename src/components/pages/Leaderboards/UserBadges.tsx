import React from 'react';
import { useSelector } from 'react-redux';

export default function UserBadges(props: {
  user: any;
  game: any;
}): JSX.Element {
  const { user, game } = props;

  const badges = useSelector((state: any) =>
    state.badges.filter((badge: any) =>
      game?.badges?.includes(
        badge['_id'] && user?.badges?.includes([badge['_id']]),
      ),
    ),
  );

  // if (game.badges) {
  //   console.log(game.badges);
  // }
  // if (user.badges) {
  //   console.log(user.badges);
  // }

  console.log(user);

  console.log(!!badges);
  return <div></div>;
}
