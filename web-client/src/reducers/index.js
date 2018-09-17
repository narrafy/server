import {combineReducers} from 'redux'
import conversationReducer  from './conversation'
import authenticationReducer from './authentication'

const rootReducer = combineReducers({
    conversationReducer,
    authenticationReducer
})
export default rootReducer