import * as types from '../actions/types'
import {authToken, isValidToken, getProfile} from '../utils'

const initialState = authToken && isValidToken(authToken) ? 
    {loggedIn: true, profile: getProfile(authToken)}: 
    {}

const auth = (state = initialState, action) =>{

    switch(action.type){
        
        case types.REQUEST_LOGIN:{
            return {...state,
                loggingIn: true
            }
        }

        case types.SUCCESS_LOGIN: {

            return {...state,
                loggingIn: false,
                loggedIn: true,
                profile: action.payload
            }
        }
        
        case types.LOGOUT:
        case types.FAILURE_LOGIN: {
            return {...state,
                loggingIn: false,
                loggedIn: false,
                error: action.payload
            }
        }

        default:
            return state
    }
}

export default auth