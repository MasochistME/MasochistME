import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import '../styles/css/App.css';
import axios from 'axios';
import { orderBy } from 'lodash';
import Page from 'components/pages';
// import LoginModal from 'shared/components/LoginModal';
import {
  cacheGames,
  cacheMembers,
  cacheRating,
  cacheEvents,
  cacheBlog,
  cachePatrons,
  cacheBadges,
} from 'shared/store/modules/Cache';
import { showGamesRated } from 'shared/store/modules/CheckBoxes';

const path = 'http://localhost:3002';

export default function App(): JSX.Element {
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);

  const rating = useSelector((state: any) => state.rating);
  const badges = useSelector((state: any) => state.badges);

  const loadRating = () => {
    axios
      .get(`${path}/api/rating`)
      .then(response => {
        if (response?.status === 200) {
          dispatch(showGamesRated(response.data.map((r: any) => r.id)));
          dispatch(cacheRating(response.data));
        }
      })
      .catch(err => console.trace(err));
  };

  const loadGames = () => {
    axios
      .get(`${path}/api/curator/games`)
      .then(response => {
        if (response?.status === 200) {
          return dispatch(
            cacheGames(
              orderBy(response.data, ['rating', 'title'], ['desc', 'asc']),
            ),
          );
        }
      })
      .catch(err => console.log(err.message));
  };

  const loadMembers = () => {
    axios
      .get(`${path}/api/members`)
      .then(response => {
        if (response?.status === 200) {
          let members = response.data;
          members.map((member: any) => {
            let summary = 0;
            rating.map(
              (r: any) =>
                (summary += member.ranking[r.id]
                  ? r.score * member.ranking[r.id]
                  : 0),
            );
            member.badges.map((badge: any) => {
              const membersBadge = badges.find(
                (b: any) => badge.id === b['_id'], // TODO equality
              );
              if (membersBadge) {
                if (typeof membersBadge.points !== 'number') {
                  membersBadge.points = parseInt(membersBadge.points);
                }
                summary += membersBadge.points;
              }
            });
            member.points = summary;
            return member;
          });
          members = orderBy(members, ['points'], ['desc']);
          return dispatch(cacheMembers(members));
        }
      })
      .catch(err => console.trace(err));
  };

  const loadEvents = () => {
    axios
      .get(`${path}/api/events`)
      .then(response => {
        if (response?.status === 200) {
          return dispatch(cacheEvents(response.data));
        }
      })
      .catch(err => console.trace(err));
  };

  const loadPatrons = () => {
    axios
      .get(`${path}/api/patrons`)
      .then(response => {
        if (response?.status === 200) {
          return dispatch(cachePatrons(response.data));
        }
      })
      .catch(err => console.trace(err));
  };

  const loadBlog = () => {
    axios
      .get(`${path}/api/blog`)
      .then(response => {
        if (response?.status === 200) {
          return dispatch(cacheBlog(response.data));
        }
      })
      .catch(err => console.trace(err));
  };

  const loadBadges = () => {
    axios
      .get(`${path}/api/badges`)
      .then(response => {
        if (response?.status === 200) {
          return dispatch(cacheBadges(response.data));
        }
      })
      .catch(err => console.trace(err));
  };

  const load = () => {
    loadBadges();
    loadRating();
    loadGames();
    loadEvents();
    loadBlog();
    loadPatrons();
    setLoaded(true);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (rating) {
      loadMembers();
    }
  }, [rating]);

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
        <Route>
          <Page page="notfound" />
        </Route>
      </Switch>
    </Router>
  ) : (
    <div>Loading...</div>
  );
}
