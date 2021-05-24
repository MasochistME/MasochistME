import React, { useContext } from 'react';
import { useHistory } from 'react-router';
import { Dropdown, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { Flex } from 'shared/components';
import { AppContext } from 'shared/store/context';
import login_button from 'shared/images/steam_login.png';

export default function Login(): JSX.Element {
  const { path, isLoggedIn } = useContext(AppContext);

  const onLogIn = () => window.open(`${path}/auth/steam`, '_self');

  if (isLoggedIn) {
    return <LoggedUserMenu />;
  }
  return (
    <img
      className="button"
      src={login_button}
      alt="Login via Steam"
      onClick={onLogIn}
    />
  );
}

const LoggedUserMenu = () => {
  const history = useHistory();
  const { path, isLoggedIn, userId, username, isAdmin } = useContext(
    AppContext,
  );

  const onLogOut = () => window.open(`${path}/auth/steam/logout`, '_self');
  const onShowProfile = (): void => {
    if (!isLoggedIn) {
      alert('You are not logged in!');
      return;
    }
    history.push(`/profile/${userId}`);
  };
  const onManageBadgesClick = (): void => {
    history.push('/admin/badges');
  };
  const onManageUsersClick = (): void => {
    history.push('/admin/users');
  };
  const onManageGamesClick = (): void => {
    history.push('/admin/games');
  };

  const menu = (
    <Menu theme="dark">
      <Menu.Item onClick={onShowProfile}>
        <i className="fas fa-user-cog" /> Your profile
      </Menu.Item>
      {isAdmin && (
        <Menu.SubMenu
          key="sub1"
          icon={<i className="fas fa-tools" />}
          title=" Administration">
          <Menu.Item onClick={onManageUsersClick}>
            <i className="fas fa-users-cog" /> Manage users
          </Menu.Item>
          <Menu.Item onClick={onManageBadgesClick}>
            <i className="fas fa-award" /> Manage badges
          </Menu.Item>
          <Menu.Item onClick={onManageGamesClick}>
            <i className="fas fa-gamepad" /> Manage games
          </Menu.Item>
        </Menu.SubMenu>
      )}
      <Menu.Item onClick={onLogOut} danger>
        <i className="fas fa-sign-out-alt" /> Log out
      </Menu.Item>
    </Menu>
  );

  return (
    <Flex row>
      <Dropdown overlay={menu}>
        {/* <a className="ant-dropdown-link" onClick={e => e.preventDefault()}> */}
        <div className="button flex-row" style={{ borderLeft: 'none' }}>
          Hello, {username}! <DownOutlined />
        </div>
        {/* </a> */}
      </Dropdown>
    </Flex>
  );
};
