import * as types from '../actions/types'

const visitor = (state = {isOpen: false}, action) =>{

    switch(action.type){

        case types.TOGGLE_NAVBAR: {
            return {...state,
                isOpen: !isOpen
            }
        }

        case types.CONTACT_REQUEST: {
            return {...state,
                contact_submitted: true
            }
        }

        case types.CONTACT_FAILURE:
        case types.CONTACT_SUCCESS: {
            return {...state,
                contact_notification: action.payload.message
            }
        }

        case types.SUBMIT_REQUEST: {
            return {...state,
                submitRequest: true
            }
        }

        case types.SUBMIT_FAILURE:
        case types.SUBMIT_SUCCESS: {
            return {...state,
                submit_notification: action.payload.message
            }
        }

        default:
            return state
    }
}

export default visitor