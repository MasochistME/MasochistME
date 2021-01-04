import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Section, SectionTitle } from '../../';

export default function SectionUpdate(): JSX.Element {
  // const updateTimeout = 43200000;
  const [lastUpdated, setLastUpdated] = useState(
    undefined as number | undefined,
  );
  // const updating = false; // TODO connect to websocket
  // const updateStatus = 50; // TODO connect to websocket

  // const sendUpdateRequest = (): void => {
  //   const url = '/rest/update';
  //   axios
  //     .get(url)
  //     .then(res => console.log(res.data.content))
  //     .catch(err => console.log(err));
  // };

  // const timeoutBeforeUpdate = (): number => {
  //   const timeout = Math.ceil(
  //     (updateTimeout - (Date.now() - Number(lastUpdated))) / 60000,
  //   );
  //   return timeout;
  // };

  // const blockUpdateIfTooSoon = (): boolean => timeoutBeforeUpdate() > 0;

  // const timeToUpdate = `${Math.ceil(
  //   (updateTimeout - (Date.now() - Number(lastUpdated))) / 3600000,
  // )}:${Math.ceil(
  //   ((updateTimeout - (Date.now() - Number(lastUpdated))) % 3600000) / 60000,
  // )} hours till you can update again`;

  const getUpdateDate = (): void => {
    const url = '/rest/status';
    axios
      .get(url)
      .then(res => setLastUpdated(res.data.lastUpdated))
      .catch(err => {
        setLastUpdated(undefined);
        console.log(err);
      });
  };

  const nextUpdate = lastUpdated
    ? new Date(lastUpdated + 43200000).toLocaleString()
    : 'unknown';

  useEffect(() => {
    getUpdateDate();
  }, []);

  return (
    <Section>
      <SectionTitle
        style={{ height: '100%' }}>{`Next update: ${nextUpdate}`}</SectionTitle>
      {/* <h3 className="section-title">
        Last updated: {new Date(Number(lastUpdated)).toLocaleString()}
      </h3> */}
      {/* <div className="flex-column">
        {updating ? (
          <div
            className="update-progress-bar-border"
            title={`${updateStatus}%`}>
            <div
              className="update-progress-bar"
              style={{ width: `${updateStatus}%` }}></div>
            <div className="update-progress-bar-percentage">Updating...</div>
          </div>
        ) : (
          <button
            className={
              blockUpdateIfTooSoon()
                ? 'custom-button update-button button-blocked'
                : 'custom-button update-button'
            }
            onClick={() =>
              blockUpdateIfTooSoon() ? null : sendUpdateRequest()
            }
            title={blockUpdateIfTooSoon() ? timeToUpdate : 'Update'}>
            Update
          </button>
        )}
      </div> */}
    </Section>
  );
}
