import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import _ from 'lodash';
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

class App extends Component {
  constructor() {
    super();
    this.state = { loaded: false };
  }

  loadRating = () => {
    axios
      .get('/rest/api/rating')
      .then(response => {
        if (response.status === 200) {
          this.props.dispatch(showGamesRated(response.data.map(r => r.id)));
          this.props.dispatch(cacheRating(response.data));
        }
      })
      .catch(err => console.trace(err));
  };

  loadGames = () => {
    axios
      .get('/rest/api/games')
      .then(response => {
        if (response.status === 200) {
          return this.props.dispatch(
            cacheGames(
              _.orderBy(response.data, ['rating', 'title'], ['desc', 'asc']),
            ),
          );
        }
      })
      .catch(err => console.log(err.message));
  };

  loadMembers = () => {
    axios
      .get('/rest/api/members')
      .then(response => {
        if (response.status === 200) {
          let members = response.data;
          members.map(member => {
            let summary = 0;
            this.props.state.rating.map(
              r =>
                (summary += member.ranking[r.id]
                  ? r.score * member.ranking[r.id]
                  : 0),
            );
            member.badges.map(badge => {
              const membersBadge = this.props.state.badges.find(
                b => badge.id == b['_id'],
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
          members = _.orderBy(members, ['points'], ['desc']);
          return this.props.dispatch(cacheMembers(members));
        }
      })
      .catch(err => console.trace(err));
  };

  loadEvents = () => {
    axios
      .get('/rest/api/events')
      .then(response => {
        if (response.status === 200) {
          return this.props.dispatch(cacheEvents(response.data));
        }
      })
      .catch(err => console.trace(err));
  };

  loadPatrons = () => {
    axios
      .get('/rest/api/patrons')
      .then(response => {
        if (response.status === 200) {
          return this.props.dispatch(cachePatrons(response.data));
        }
      })
      .catch(err => console.trace(err));
  };

  loadBlog = () => {
    axios
      .get('/rest/api/blog')
      .then(response => {
        if (response.status === 200) {
          return this.props.dispatch(cacheBlog(response.data));
        }
      })
      .catch(err => console.trace(err));
  };

  loadBadges = () => {
    axios
      .get('/rest/api/badges')
      .then(response => {
        if (response.status === 200) {
          return this.props.dispatch(cacheBadges(response.data));
        }
      })
      .catch(err => console.trace(err));
  };

  load() {
    this.loadBadges();
    this.loadRating();
    this.loadMembers();
    this.loadGames();
    this.loadEvents();
    this.loadBlog();
    this.loadPatrons();
    this.setState({ loaded: true });
  }

  componentDidMount = () => this.load();

  render() {
    return this.state.loaded ? (
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
      <div>Not loaded yet.</div>
    );
  }
}

const mapStateToProps = state => ({ state });
const mapDispatchToProps = dispatch => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(App);
