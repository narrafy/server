import {combineReducers} from 'redux'
import conversation  from './conversation'
import auth from './authentication'
import visitor from './visitor'
import thread from './thread'
import alert from './alert'

const rootReducer = combineReducers({
    conversation,
    auth,
    alert,
    visitor,
    thread
})
export default rootReducer