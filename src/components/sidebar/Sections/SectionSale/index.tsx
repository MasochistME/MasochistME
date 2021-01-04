import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { orderBy } from 'lodash';
import { Section, SectionTitle, SaleLink } from '../../';
import Spinner from 'shared/components/Spinner';

export const SectionSaleUl = styled.ul`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  list-style-type: none;
`;

export default function SectionSale(): JSX.Element {
  const games = useSelector((state: any) =>
    orderBy(state.games, ['sale.discount'], ['desc']),
  );

  const gamesOnSale = games
    .filter(game => game.sale.onSale)
    .map((game, index) => (
      <li
        key={`sale-${index}`}
        className="sale-brick"
        style={{ backgroundImage: `url(${game.img})` }}>
        <SaleLink
          href={`https://store.steampowered.com/app/${game.id}`}
          target="_blank"
          rel="noopener noreferrer">
          <span className="link">-{game.sale.discount}%</span>
        </SaleLink>
      </li>
    ));

  return (
    <Section>
      <SectionTitle>Games on sale</SectionTitle>
      <SectionSaleUl>
        {gamesOnSale.length ? gamesOnSale : <Spinner />}
      </SectionSaleUl>
    </Section>
  );
}
