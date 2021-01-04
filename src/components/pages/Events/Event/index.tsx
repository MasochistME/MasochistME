import React from 'react';
import {
  AchievementNumberChangeEvent,
  CompleteEvent,
  CustomEvent,
  GameEvent,
  MemberEvent,
  TierChangeEvent,
} from './EventTypes';

type TEvent = {
  event: any;
};
export default function Event(props: TEvent): JSX.Element | null {
  const { event } = props;

  const sortEvents = (event: any): JSX.Element | null => {
    switch (event.type) {
      case 'newGame':
        return <GameEvent event={event} />;
      case 'memberJoined':
        return <MemberEvent event={event} action="join" />;
      case 'memberLeft':
        return <MemberEvent event={event} action="leave" />;
      case 'complete':
        return <CompleteEvent event={event} />;
      case 'tierChange':
        return <TierChangeEvent event={event} />;
      case 'achievementNumberChange':
        return <AchievementNumberChangeEvent event={event} />;
      case 'custom':
        return <CustomEvent event={event} />;
      default:
        return null;
    }
  };

  const relevantEvent = sortEvents(event);

  return relevantEvent ? (
    <li className="event flex-row" key={`event-${Date.now()}`}>
      <div className="event-date">
        {' '}
        {new Date(event.date).toLocaleString()}{' '}
      </div>
      {relevantEvent}
    </li>
  ) : null;
}
