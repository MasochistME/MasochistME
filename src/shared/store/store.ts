import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import tabs from '../config/tabs.json';
import { CHANGE_TAB } from './modules/Tabs';
import { SEARCH_GAME, SEARCH_USER } from './modules/Search';
import { SHOW_GAMES_RATED } from './modules/CheckBoxes';
import { SHOW_PROFILE } from './modules/Profiles';
import { SHOW_LOGIN_MODAL, LOG_IN_USER, LOG_OUT_USER } from './modules/Login';
import {
  CACHE_GAMES,
  CACHE_USERS,
  CACHE_RATING,
  CACHE_EVENTS,
  CACHE_BLOG,
  CACHE_PATRONS,
  CACHE_BADGES,
  CACHE_RANKING,
} from './modules/Cache';

// STORES
type TStore = {
  games: any[];
  users: any[];
  events: any[];
  blog: any[];
  patrons: any[];
  badges: any[];
  ranking: any[];
  rating: null;
  tabs: {
    active: 'home';
    list: any[];
    profile: any;
  };
  search: {
    game: string;
    user: string;
  };
  profile: {
    username: string | undefined;
    privilege: string | undefined;
    banned: boolean;
    logged: boolean;
  };
  showLoginModal: boolean;
  showGamesRated: any[];
};

const defaultState: TStore = {
  games: [],
  users: [],
  events: [],
  blog: [],
  patrons: [],
  badges: [],
  ranking: [],
  rating: null,
  tabs: {
    active: 'home',
    list: tabs,
    profile: null,
  },
  search: {
    game: '',
    user: '',
  },
  profile: {
    username: undefined,
    privilege: undefined,
    banned: false,
    logged: false,
  },
  showLoginModal: false,
  showGamesRated: [],
};

const reducer = (state = defaultState, action: any) => {
  switch (action.type) {
    case CHANGE_TAB:
      return {
        ...state,
        search: {
          game: '',
          user: '',
        },
        tabs: {
          ...state.tabs,
          active: action.tab,
        },
      };
    case SEARCH_GAME:
      return {
        ...state,
        search: { ...state.search, game: action.game },
      };
    case SEARCH_USER:
      return {
        ...state,
        search: { ...state.search, user: action.user },
      };
    case SHOW_GAMES_RATED:
      return {
        ...state,
        showGamesRated: action.showGamesRated,
      };
    case SHOW_LOGIN_MODAL:
      return {
        ...state,
        showLoginModal: !state.showLoginModal,
      };
    case SHOW_PROFILE:
      return {
        ...state,
        tabs: {
          ...state.tabs,
          profile: action.id,
        },
      };
    case LOG_IN_USER:
      return {
        ...state,
        profile: {
          username: action.username,
          privilege: action.privilege,
          logged: true,
          banned: action.banned,
        },
      };
    case LOG_OUT_USER:
      return {
        ...state,
        profile: {
          username: undefined,
          privilege: undefined,
          logged: false,
          banned: false,
        },
        tabs: {
          ...state.tabs,
          active: 'home',
        },
      };
    case CACHE_GAMES:
      return {
        ...state,
        games: action.data,
      };
    case CACHE_USERS:
      return {
        ...state,
        users: action.data,
      };
    case CACHE_RATING:
      return {
        ...state,
        rating: action.data,
      };
    case CACHE_EVENTS:
      return {
        ...state,
        events: action.data,
      };
    case CACHE_PATRONS:
      return {
        ...state,
        patrons: action.data,
      };
    case CACHE_BLOG:
      return {
        ...state,
        blog: action.data,
      };
    case CACHE_BADGES:
      return {
        ...state,
        badges: action.data,
      };
    case CACHE_RANKING:
      return {
        ...state,
        ranking: action.data,
      };
    default:
      return state;
  }
};

const middleWare = [thunk];
const composeEnhancers = composeWithDevTools(applyMiddleware(...middleWare));
const store = createStore(reducer, defaultState, composeEnhancers);

export default store;
