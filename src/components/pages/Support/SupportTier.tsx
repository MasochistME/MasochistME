import React from 'react';
import styled from 'styled-components';
import { orderBy } from 'lodash';
import { colors } from 'shared/theme';
import SupportPatron from './SupportPatron';

const Tier = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  h2 {
    border-bottom: 2px solid ${colors.lightGrey};
    padding-bottom: 10px;
  }
`;
const Patrons = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`;

type TSupportTier = {
  tier: any;
};

export default function SupportTier(props: TSupportTier): JSX.Element {
  const { tier } = props;
  const patrons = orderBy(
    tier.list,
    [patron => patron.name.toLowerCase()],
    ['asc'],
  );

  return (
    <Tier>
      <h2>
        <i className={tier.symbol} /> - {tier.description}
      </h2>
      <Patrons>
        {patrons.map((patron, index) => (
          <SupportPatron
            key={`patron-${index}`}
            patron={patron}
            tier={tier.tier}
          />
        ))}
      </Patrons>
    </Tier>
  );
}
