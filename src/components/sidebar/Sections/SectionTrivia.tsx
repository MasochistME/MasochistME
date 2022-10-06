import React from 'react';
import { useSelector } from 'react-redux';

import { useUsers } from 'shared/hooks';
import { Spinner } from 'shared/components';
import { Section, SectionTitle } from '../';

export default function SectionTrivia(): JSX.Element {
  const users = useUsers(true);
  const rating = useSelector((state: any) => state.rating);
  const games = useSelector((state: any) => state.games.list);

  const mapCurated = () => {
    if (games && rating) {
      return rating.map((tier: any, index: number) => {
        return (
          <li style={{ marginLeft: '30px' }} key={`${tier.score}-${index}`}>
            <i className={tier.icon} />
            <span className="bold">{` : ${
              games.filter(
                (game: any) => Number(game.rating) === Number(tier.id),
              ).length
            }`}</span>
          </li>
        );
      });
    }
  };

  return (
    <Section>
      <SectionTitle>Trivia</SectionTitle>
      {users.length && rating ? (
        <>
          <p>
            Users total: <span className="bold">{users.length}</span>
          </p>
          <p>Curated games:</p>
          <ul>
            <li style={{ marginLeft: '30px' }}>
              total: <span className="bold">{games.length}</span>
            </li>
            <ul>{mapCurated()}</ul>
          </ul>
        </>
      ) : (
        <Spinner />
      )}
    </Section>
  );
}
