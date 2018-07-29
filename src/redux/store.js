import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import tabs from '../config/tabs.json'
import { CHANGE_TAB } from './modules/Tabs'
import { SEARCH_GAMES_VALUE, SEARCH_MEMBERS_VALUE } from './modules/Search'

const defaultState = {
    activeTab: "home",
    tabs: tabs,
    searchGame: "",
    searchMember: ""
}
const enhancers = [ ]
const middleWare = [ thunk ]
const composedEnhancers = compose(
    applyMiddleware(...middleWare),
    ...enhancers
)

const reducer = (state = defaultState, action) => {
    switch (action.type) {
        case CHANGE_TAB: return {
            ...state,
            activeTab: action.tab
        }
        case SEARCH_GAMES_VALUE: return {
            ...state,
            searchGame: action.game
        }
        case SEARCH_MEMBERS_VALUE: return {
            ...state,
            searchMember: action.member
        }
        default: return state
    }
}

const store = createStore(
    reducer,
    defaultState,
    composedEnhancers
)

export default store