import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { orderBy } from 'lodash';
import '../styles/css/App.css';
import Wrapper from '../shared/components/layout/Wrapper';
import Header from '../shared/components/Header';
import Nav from '../shared/components/Nav';
import ContentWrapper from '../shared/components/layout/ContentWrapper';
import SidebarWrapper from './sidebar/SidebarWrapper';
import LoginModal from '../shared/components/LoginModal/index';
import {
  cacheGames,
  cacheMembers,
  cacheRating,
  cacheEvents,
  cacheBlog,
  cachePatrons,
  cacheBadges,
} from '../shared/store/modules/Cache';
import { showGamesRated } from '../shared/store/modules/CheckBoxes';

export default function App(): JSX.Element {
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);

  const rating = useSelector((state: any) => state.rating);
  const badges = useSelector((state: any) => state.badges);

  const loadRating = () => {
    axios
      .get('/rest/api/rating')
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
      .get('/rest/api/games')
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
      .get('/rest/api/members')
      .then(response => {
        if (response?.status === 200) {
          let members = response.data;
          members.map((member: any) => {
            let summary = 0;
            rating.map(
              r =>
                (summary += member.ranking[r.id]
                  ? r.score * member.ranking[r.id]
                  : 0),
            );
            member.badges.map((badge: any) => {
              const membersBadge = badges.find(
                (b: any) => badge.id == b['_id'],
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
      .get('/rest/api/events')
      .then(response => {
        if (response?.status === 200) {
          return dispatch(cacheEvents(response.data));
        }
      })
      .catch(err => console.trace(err));
  };

  const loadPatrons = () => {
    axios
      .get('/rest/api/patrons')
      .then(response => {
        if (response?.status === 200) {
          return dispatch(cachePatrons(response.data));
        }
      })
      .catch(err => console.trace(err));
  };

  const loadBlog = () => {
    axios
      .get('/rest/api/blog')
      .then(response => {
        if (response?.status === 200) {
          return dispatch(cacheBlog(response.data));
        }
      })
      .catch(err => console.trace(err));
  };

  const loadBadges = () => {
    axios
      .get('/rest/api/badges')
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
    loadMembers();
    loadGames();
    loadEvents();
    loadBlog();
    loadPatrons();
    setLoaded(true);
  };

  useEffect(() => {
    load();
  }, []);

  return loaded ? (
    <Wrapper type="main">
      <LoginModal />
      <Header />
      <Wrapper type="nav">
        <Nav />
      </Wrapper>
      <Wrapper type="middle">
        <ContentWrapper />
        <SidebarWrapper />
      </Wrapper>
      <Wrapper type="footer" />
    </Wrapper>
  ) : (
    <div>Loading...</div>
  );
}
