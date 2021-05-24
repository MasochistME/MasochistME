import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Page from 'components/pages';
import { log } from 'shared/helpers';
import { useUserPermissions } from 'shared/hooks';
import { AppContext } from 'shared/store/context';
import useInit from './init';

export default function App(): JSX.Element {
  const loaded = useInit();
  const {
    path,
    isLoggedIn,
    setIsLoggedIn,
    setUsername,
    setUserId,
  } = useContext(AppContext);

  useUserPermissions();

  useEffect(() => {
    if (!isLoggedIn) {
      fetch(`${path}/auth/steam/success`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Access-Control-Allow-Credentials': '*' },
      })
        .then(async (response: any) => {
          if (response?.status === 200) {
            const userData = await response?.json();
            setUsername(userData.user.name);
            setUserId(userData.user.id);
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
          }
        })
        .catch(log.WARN);
    }
  });

  return loaded ? (
    <Router>
      <Switch>
        <Route exact path="/">
          <Page page="home" />
        </Route>
        <Route exact path="/home">
          <Page page="home" />
        </Route>
        <Route exact path="/games">
          <Page page="games" />
        </Route>
        <Route exact path="/ranking">
          <Page page="ranking" />
        </Route>
        <Route exact path="/events">
          <Page page="events" />
        </Route>
        <Route exact path="/support">
          <Page page="support" />
        </Route>
        <Route exact path="/badges">
          <Page page="badges" />
        </Route>
        <Route exact path="/profile/:id">
          <Page page="profile" />
        </Route>
        <Route exact path="/game/:id">
          <Page page="game" />
        </Route>
        {/** admin pages */}
        <Route exact path="/admin/badges">
          <Page page="admin" subpage="badges" />
        </Route>
        <Route exact path="/admin/games">
          <Page page="admin" subpage="games" />
        </Route>
        <Route exact path="/admin/users">
          <Page page="admin" subpage="users" />
        </Route>
        {/** other */}
        <Route>
          <Page page="notfound" />
        </Route>
      </Switch>
    </Router>
  ) : (
    <div>Loading...</div>
  );
}
