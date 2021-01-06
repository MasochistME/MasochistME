import React from 'react';
import { useSelector } from 'react-redux';
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

  const users = useSelector((state: any) => state.users);

  if (!content) {
    return null;
  }
  const { text, icon, user } = content;
  const userData = users.find((m: any) => Number(m.id) === Number(user));

  return (
    <div className="event-info flex-row">
      <img
        className="event-img"
        alt="avatar"
        src={userData ? userData.avatar : logo}></img>
      {
        <div className="event-desc">
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
        </div>
      }
      <div className="event-summary flex-row">
        <i className={icon ? icon : 'fas fa-birthday-cake'}></i>
        <img className="event-img" alt="custom-img" src={logo}></img>
      </div>
    </div>
  );
}
