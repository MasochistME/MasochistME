import React, { useContext } from 'react';
import { useHistory } from 'react-router';
import { Flex } from 'shared/components';
import { AppContext } from 'shared/store/context';
import login_button from 'shared/images/steam_login.png';

export default function Login(): JSX.Element {
  const history = useHistory();
  const { path, loggedIn, userId, username } = useContext(AppContext);

  const onShowProfile = (): void => {
    if (!loggedIn) {
      alert('You are not logged in!');
      return;
    }
    history.push(`/profile/${userId}`);
  };
  const onLogIn = () => window.open(`${path}/auth/steam`, '_self');
  const onLogOut = () => window.open(`${path}/auth/steam/logout`, '_self');

  return (
    <div>
      {!loggedIn ? (
        <img
          className="button"
          src={login_button}
          alt="Login via Steam"
          onClick={onLogIn}
        />
      ) : (
        <Flex row>
          <div
            className="button flex-row"
            style={{ borderLeft: 'none' }}
            onClick={onShowProfile}>
            <p>Hello, {username}!</p>
          </div>
          <Flex className="button" onClick={onLogOut}>
            <p>Log out</p>
            <i className="fas fa-sign-out-alt"></i>
          </Flex>
        </Flex>
      )}
    </div>
  );
}
