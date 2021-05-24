import React from 'react';
import { orderBy } from 'lodash';
import { useSelector } from 'react-redux';
import { Wrapper, Flex } from 'shared/components';

export default function PageBadges(): JSX.Element {
  const games = useSelector((state: any) => state.games.list);
  const badges = useSelector((state: any) =>
    orderBy(
      state.badges.map(
        (badge: any) =>
          (badge = {
            ...badge,
            game: badge.isNonSteamGame
              ? badge.game
              : games.find((game: any) => game.id === badge.gameId)?.title ??
                'unknown',
          }),
      ),
      ['gameId'],
      ['desc'],
    ),
  );

  return (
    <Flex column>
      <Wrapper type="description">
        <div className="page-description">
          <p>This is the list showcasing the last 100 events.</p>
          <p>There are six different types of events:</p>
        </div>
      </Wrapper>
      <Wrapper type="page">
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
      </Wrapper>
    </Flex>
  );
}
