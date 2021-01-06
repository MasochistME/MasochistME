import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Section, SectionTitle } from '../';

export default function SectionTrivia(): JSX.Element {
  const users = useSelector((state: any) =>
    state.users.filter((user: any) => user.user),
  );
  const rating = useSelector((state: any) => state.rating);
  const [games, setGames] = useState({
    total: 0,
    all: [],
  });

  const loadGames = async (): Promise<void> => {
    const response = await axios.get('/rest/api/games');
    if (!response?.data) {
      return;
    }
    setGames({
      total: response?.data?.length,
      all: response?.data,
    });
  };

  const mapCurated = () => {
    if (rating) {
      return rating.map((tier: any, index: number) => (
        <li style={{ marginLeft: '30px' }} key={`${tier.score}-${index}`}>
          <i className={tier.icon} />
          <span className="bold">{` : ${
            games.all.filter((game: any) => game.rating === tier.id).length
          }`}</span>
        </li>
      ));
    }
  };

  useEffect(() => {
    loadGames();
  }, []);

  return (
    <Section>
      <SectionTitle>Trivia</SectionTitle>
      <p>
        Members total: <span className="bold">{users.length}</span>
      </p>
      <p>Curated games:</p>
      <ul>
        <li style={{ marginLeft: '30px' }}>
          total: <span className="bold">{games.total}</span>
        </li>
        <ul>{mapCurated()}</ul>
      </ul>
    </Section>
  );
}
