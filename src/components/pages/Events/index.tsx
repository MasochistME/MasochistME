import React from 'react';
import { useSelector } from 'react-redux';
import { Wrapper, Spinner } from 'shared/components';
import Event from './Event';

export default function PageEvents(): JSX.Element {
  const events = useSelector((state: any) => state.events);

  return (
    <div className="flex-column">
      <Wrapper type="description">
        <div className="page-description">
          <p>This is the list showcasing the last 100 events.</p>
          <p>There are six different types of events:</p>
          <ul className="event-types">
            <li>
              <i className="fas fa-user-plus"></i> - new user joining the
              community,
            </li>
            <li>
              <i className="fas fa-user-minus"></i> - user leaving the
              community,
            </li>
            <li>
              <i className="fas fa-plus-square"></i> - new game being curated,
            </li>
            <li>
              <i className="fas fa-check-square"></i> - user of the community
              finishing 100% of the game,
            </li>
            <li>
              <i className="fas fa-caret-square-up"></i> - game promoting a
              tier,
            </li>
            <li>
              <i className="fas fa-caret-square-down"></i> - game demoting a
              tier,
            </li>
            <li>
              <i className="fas fa-tasks"></i> - game having achievements added
              or removed.
            </li>
          </ul>
          <p>
            In case of event relating to a no longer curated game or user no
            longer being part of the group, the{' '}
            <i className="fas fa-exclamation-triangle"></i> icon is used.
          </p>
        </div>
      </Wrapper>
      <div className="wrapper-events">
        <ul className="events-list">
          {events && events.length ? (
            events.map((event: any, eventIndex: number) => (
              <Event event={event} key={`event-${eventIndex}`} />
            ))
          ) : (
            <Spinner />
          )}
        </ul>
      </div>
    </div>
  );
}
