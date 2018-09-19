import {combineReducers} from 'redux'
import conversation  from './conversation'
import auth from './authentication'
import visitor from './visitor'
import thread from './thread'

const rootReducer = combineReducers({
    conversation,
    auth,
    visitor,
    thread
})
export default rootReducer