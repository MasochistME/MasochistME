import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import tabs from '../config/tabs.json'
import rating from '../config/rating.json'
import { CHANGE_TAB } from './modules/Tabs'
import { SEARCH_GAMES_VALUE, SEARCH_MEMBERS_VALUE } from './modules/Search'
import { SHOW_GAMES_RATED } from './modules/CheckBoxes'
import { SHOW_PROFILE } from './modules/Profiles'
import { SHOW_LOGIN_MODAL, LOG_IN_USER, LOG_OUT_USER } from './modules/Login'
import { CACHE_GAMES, CACHE_MEMBERS, CACHE_RATING, CACHE_EVENTS, CACHE_BLOG, CACHE_PATRONS } from './modules/Cache'

const ratingArray = () => rating.map(r => r.score.toString())

// STORES
const defaultState = {
    activeTab: "home",
    tabs: tabs,
    searchGame: "",
    searchMember: "",
    showLoginModal: false,
    showGamesRated: [ ...ratingArray() ],
    username: null,
    privilege: null,
    banned: false,
    logged: false,
    games: [],
    members: [],
    events: [],
    blog: [],
    patrons: [],
    rating: null,
    profileID: null
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
            activeTab: action.tab,
            searchGame: "",
            searchMember: ""
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
        case SHOW_PROFILE: return {
            ...state,
            profileID: action.id
        }
        case LOG_IN_USER: return {
            ...state,
            username: action.username,
            privilege: action.privilege,
            logged: true,
            banned: action.banned
        }
        case LOG_OUT_USER: return {
            ...state,
            username: null,
            privilege: null,
            logged: false,
            banned: false,
            activeTab: "home"
        }
        case CACHE_GAMES: return {
            ...state,
            games: action.data
        }
        case CACHE_MEMBERS: return {
            ...state,
            members: action.data
        }
        case CACHE_RATING: return {
            ...state,
            rating: action.data
        }
        case CACHE_EVENTS: return {
            ...state,
            events: action.data
        }
        case CACHE_PATRONS: return {
            ...state,
            patrons: action.data
        }
        case CACHE_BLOG: return {
            ...state,
            blog: action.data
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