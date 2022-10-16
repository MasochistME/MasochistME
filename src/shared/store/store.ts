import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import { CHANGE_GAMES_VIEW } from './modules/Tabs';
import { SEARCH_GAME, SEARCH_USER } from './modules/Search';
import { SHOW_GAMES_RATED } from './modules/CheckBoxes';
import {
	CACHE_GAMES,
	CACHE_USERS,
	CACHE_BLOG,
	CACHE_PATRONS,
	CACHE_RANKING,
	CACHE_STATUS,
	CACHE_USER_DETAILS,
	CACHE_GAME_DETAILS,
} from './modules/Cache';

// STORES
type TStore = {
	games: {
		list: any[];
		details: any[];
		view: 'list' | 'tiles';
	};
	users: {
		list: any[];
		details: any[];
	};
	blog: any[];
	patrons: any[];
	ranking: any[];
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
	status: {
		lastUpdated: number | undefined;
		percentage: number;
	};
	showLoginModal: boolean;
	showGamesRated: any[];
};

const defaultState: TStore = {
	games: {
		list: [],
		details: [],
		view: 'tiles',
	},
	users: {
		list: [],
		details: [],
	},
	blog: [],
	patrons: [],
	ranking: [],
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
	status: {
		lastUpdated: undefined,
		percentage: 0,
	},
	showLoginModal: false,
	showGamesRated: [],
};

const reducer = (state = defaultState, action: any) => {
	switch (action.type) {
		case CHANGE_GAMES_VIEW:
			return {
				...state,
				games: {
					...state.games,
					view: action.view,
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
		case CACHE_GAMES:
			return {
				...state,
				games: {
					...state.games,
					list: action.data,
				},
			};
		case CACHE_USERS:
			return {
				...state,
				users: {
					...state.users,
					list: action.data,
				},
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
		case CACHE_RANKING:
			return {
				...state,
				ranking: action.data,
			};
		case CACHE_STATUS:
			return {
				...state,
				status: {
					lastUpdated: action.data.lastUpdated,
					percentage: action.data.status,
				},
			};
		case CACHE_USER_DETAILS: {
			const details: any[] = [...state.users.details, action.data];
			return {
				...state,
				users: {
					...state.users,
					details,
				},
			};
		}
		case CACHE_GAME_DETAILS: {
			const details: any[] = [...state.games.details, action.data];
			return {
				...state,
				games: {
					...state.games,
					details,
				},
			};
		}
		default:
			return state;
	}
};

const middleWare = [thunk];
const composeEnhancers = composeWithDevTools(applyMiddleware(...middleWare));
const store = createStore(reducer, defaultState, composeEnhancers);

export default store;
