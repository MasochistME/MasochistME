import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import { CACHE_PATRONS, CACHE_STATUS } from './Cache';

// STORES
type TStore = {
	patrons: any[];
	status: {
		lastUpdated: number | undefined;
		percentage: number;
	};
};

const defaultState: TStore = {
	patrons: [],
	status: {
		lastUpdated: undefined,
		percentage: 0,
	},
};

const reducer = (state = defaultState, action: any) => {
	switch (action.type) {
		case CACHE_PATRONS:
			return {
				...state,
				patrons: action.data,
			};
		case CACHE_STATUS:
			return {
				...state,
				status: {
					lastUpdated: action.data.lastUpdated,
					percentage: action.data.status,
				},
			};
		default:
			return state;
	}
};

const middleWare = [thunk];
const composeEnhancers = composeWithDevTools(applyMiddleware(...middleWare));
const store = createStore(reducer, defaultState, composeEnhancers);

export default store;
