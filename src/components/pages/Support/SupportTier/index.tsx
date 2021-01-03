import React from 'react';
import { orderBy } from 'lodash';
import SupportPatron from '../SupportPatron';

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
    <div className="support-tier flex-column">
      <h2>
        <i className={tier.symbol} /> - {tier.description}
      </h2>
      <div className="support-patrons">
        {patrons.map((patron, index) => (
          <SupportPatron
            key={`patron-${index}`}
            patron={patron}
            tier={tier.tier}
          />
        ))}
      </div>
    </div>
  );
}
