import React, { useContext } from 'react';
import { useDispatch } from 'react-redux';
import { changeTab } from 'shared/store/modules/Tabs';
import { Flex } from 'shared/components';
import { AppContext } from 'shared/store/context';
import login_button from 'shared/images/steam_login.png';

export default function Login(): JSX.Element {
  const dispatch = useDispatch();
  const { path, loggedIn, username } = useContext(AppContext);

  const onShowProfile = (): void => {
    loggedIn ? dispatch(changeTab('profile')) : alert('You are not logged in!');
  };
  const onLogOut = (): void => alert('No.');

  return (
    <div>
      {!loggedIn ? (
        <a href={`${path}/auth/steam`}>
          <img className="button" src={login_button} alt="Login via Steam" />
        </a>
      ) : (
        <Flex row>
          <div
            className="button flex-row"
            style={{ borderLeft: 'none' }}
            onClick={onShowProfile}>
            <p>{username}</p>
          </div>
          <div className="button flex-row" onClick={onLogOut}>
            <p>Log out</p>
            <i className="fas fa-sign-out-alt"></i>
          </div>
        </Flex>
      )}
    </div>
  );
}
