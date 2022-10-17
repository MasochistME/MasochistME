import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import {
	CACHE_USERS,
	CACHE_BLOG,
	CACHE_PATRONS,
	CACHE_STATUS,
	CACHE_USER_DETAILS,
} from './Cache';

// STORES
type TStore = {
	users: {
		list: any[];
		details: any[];
	};
	blog: any[];
	patrons: any[];
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
};

const defaultState: TStore = {
	users: {
		list: [],
		details: [],
	},
	blog: [],
	patrons: [],
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
};

const reducer = (state = defaultState, action: any) => {
	switch (action.type) {
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
		default:
			return state;
	}
};

const middleWare = [thunk];
const composeEnhancers = composeWithDevTools(applyMiddleware(...middleWare));
const store = createStore(reducer, defaultState, composeEnhancers);

export default store;
