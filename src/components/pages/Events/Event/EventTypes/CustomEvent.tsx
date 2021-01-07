import React from 'react';
import { useSelector } from 'react-redux';
import {
  EventDescription,
  EventSummary,
  EventInfo,
  EventImg,
} from 'components/pages/Events/styles';
import logo from 'shared/images/logo.png';

type TCustomEvent = {
  event: any;
};

// {
//   text: String;
//   icon: String;
//   user?: String;
// }

export default function CustomEvent(props: TCustomEvent): JSX.Element | null {
  const { event } = props;
  const content = event.content;

  const users = useSelector((state: any) => state.users.list);

  if (!content) {
    return null;
  }
  const { text, icon, user } = content;
  const userData = users.find((m: any) => Number(m.id) === Number(user));

  return (
    <EventInfo>
      <EventImg alt="avatar" src={userData ? userData.avatar : logo} />
      {
        <EventDescription>
          {text &&
            text
              .split('#')
              .map((str: string, index: number) =>
                index % 2 === 1 ? (
                  <span className="bold under">{str}</span>
                ) : (
                  str
                ),
              )}
        </EventDescription>
      }
      <EventSummary>
        <i className={icon ? icon : 'fas fa-birthday-cake'}></i>
        <EventImg alt="custom-img" src={logo} />
      </EventSummary>
    </EventInfo>
  );
}
