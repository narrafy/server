import * as types from '../_constants/auth.constants'
import {getToken, isValidToken, getProfile} from '../utils'

const token = getToken()

const initialState = token && isValidToken(token) ? 
    {loggedIn: true, profile: getProfile(token)}: 
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
                user: action.payload
            }
        }
        
        case types.LOGOUT:
            return {}

        case types.FAILURE_LOGIN: {
            return {
                error: action.payload
            }
        }

        default:
            return state
    }
}

export default auth