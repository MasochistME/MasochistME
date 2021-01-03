import React from 'react';
import { orderBy } from 'lodash';
import { useSelector } from 'react-redux';

export default function PageBadges() {
  const games = useSelector((state: any) => state.games);
  const badges = useSelector((state: any) =>
    orderBy(
      state.badges.map(
        (badge: any) =>
          (badge = {
            ...badge,
            game: badge.isNonSteamGame
              ? badge.game
              : games.find((game: any) => game.id === badge.gameId).title,
          }),
      ),
      ['gameId'],
      ['desc'],
    ),
  );

  return (
    <div className="flex-column">
      <div className="wrapper-description">
        <div className="page-description">
          <p>This is the list showcasing the last 100 events.</p>
          <p>There are six different types of events:</p>
        </div>
      </div>
      <div className="wrapper-events">
        {badges.map((badge, index) => (
          <img
            className="profile-badge"
            src={badge.img}
            alt="badge"
            title={`${badge.game.toUpperCase()} - ${badge.name} (${
              badge.points
            } pts)\n"${badge.description}"`}
            key={`badge-${index}`}
          />
        ))}
      </div>
    </div>
  );
}
