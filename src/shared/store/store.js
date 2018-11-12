import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import tabs from '../config/tabs.json'
import rating from '../config/rating.json'
import { CHANGE_TAB } from './modules/Tabs'
import { SEARCH_GAMES_VALUE, SEARCH_MEMBERS_VALUE } from './modules/Search'
import { SHOW_GAMES_RATED } from './modules/CheckBoxes'
import { SHOW_LOGIN_MODAL, LOG_IN_USER, LOG_OUT_USER } from './modules/Login'

const ratingArray = () => rating.map(r => r.score.toString())
const defaultState = {
    activeTab: "home",
    tabs: tabs,
    searchGame: "",
    searchMember: "",
    showLoginModal: false,
    showGamesRated: [ ...ratingArray() ],
    username: null,
    privilege: null,
    logged: false
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
        case SHOW_GAMES_RATED: return {
            ...state,
            showGamesRated: action.showGamesRated
        }
        case SHOW_LOGIN_MODAL: return {
            ...state,
            showLoginModal: !state.showLoginModal
        }
        case LOG_IN_USER: return {
            ...state,
            username: action.username,
            privilege: action.privilege,
            logged: true
        }
        case LOG_OUT_USER: return {
            ...state,
            username: null,
            privilege: null,
            logged: false
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