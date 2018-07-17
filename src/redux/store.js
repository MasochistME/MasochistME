import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { CHANGE_TAB } from './modules/Tabs'

const defaultState = {
    activeTab: "home"
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
        default: return state
    }
}

const store = createStore(
    reducer,
    defaultState,
    composedEnhancers
)

export default store