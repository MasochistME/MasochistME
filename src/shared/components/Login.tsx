import React, { useContext } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { changeTab } from 'shared/store/modules/Tabs';
import { Flex } from 'shared/components';
import { AppContext } from 'shared/store/context';
import login_button from 'shared/images/steam_login.png';

export default function Login(): JSX.Element {
  const dispatch = useDispatch();
  const { path, loggedIn, setLoggedIn, username } = useContext(AppContext);

  const onShowProfile = (): void => {
    loggedIn ? dispatch(changeTab('profile')) : alert('You are not logged in!');
  };
  const onLogIn = async (): Promise<void> => {
    const response = await axios.get(`${path}/auth/steam`);
    if (response?.status === 200) {
      console.log('yay!');
      console.log(response);
    } else {
      console.log('nay :C');
    }
    setLoggedIn(true);
  };
  const onLogOut = () => setLoggedIn(false);

  return (
    <div>
      {!loggedIn ? (
        <img
          className="button"
          src={login_button}
          alt="Login via Steam"
          onClick={onLogIn}></img>
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
