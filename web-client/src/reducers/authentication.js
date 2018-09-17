import * as types from '../actions/types'

let profile = JSON.parse(localStorage.getItem('profile'))
const initialState = profile ? {loggedIn: true, profile}: {}

const authentication = (state = initialState, action) =>{

    switch(action.type){

        case types.LOGIN_REQUEST:{
            return {...state,
                loggingIn: true
            }
        }

        case types.LOGIN_SUCCESS: {

            return {...state,
                loggingIn: false,
                loggedIn: true,
                profile: action.payload
            }
        }
        case types.LOGOUT:
        case types.LOGIN_FAILURE: {
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

export default authentication