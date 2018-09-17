import {combineReducers} from 'redux'
import conversation  from './conversation'
import authentication from './authentication'
import visitor from './visitor'

const rootReducer = combineReducers({
    conversation,
    authentication,
    visitor
})
export default rootReducer