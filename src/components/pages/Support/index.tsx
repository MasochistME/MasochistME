import React from 'react';
import { useSelector } from 'react-redux';
import { orderBy } from 'lodash';
import SupportTier from './SupportTier/index';
import Spinner from 'shared/components/Spinner';
import patreon_button from 'shared/images/patreon.png';

export default function PageSupport(): JSX.Element {
  const patrons = useSelector((state: any) =>
    orderBy(state.patrons, ['tier'], ['desc']),
  );

  return (
    <div className="flex-column">
      <div className="wrapper-description">
        <div className="page-description">
          <div className="flex-column">
            <p
              style={{
                fontSize: '1.5em',
                textAlign: 'center',
                borderBottom: '2px solid #ccc',
                paddingTop: '10px',
                paddingBottom: '3px',
              }}>
              Hall of Fame
            </p>
            <p>
              ...for all of those, who voluntarily donated their money to
              support <span style={{ fontWeight: 'bold' }}>0.1%</span>. They are
              the ones funding the masochist.me domain and the hosting server,
              as well as assisting websites development. Soon we&lsquo;ll also
              commission pixel art to enrich the website&lsquo;s graphics.
            </p>
            <p>If you also wish to participate:</p>
            <p>
              <a
                href="https://www.patreon.com/pointonepercent"
                rel="noopener noreferrer"
                target="_blank">
                <img
                  className="patreon-button"
                  src={patreon_button}
                  alt="Patreon button"
                  width="200px"
                />
              </a>
            </p>
          </div>
        </div>
      </div>
      <div className="wrapper-support flex-column">
        {patrons.length !== 0 ? (
          patrons.map((tier, index) => (
            <SupportTier key={`tier-${index}`} tier={tier} />
          ))
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  );
}
