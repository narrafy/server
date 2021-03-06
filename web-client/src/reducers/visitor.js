import * as types from '../_constants/types'

const visitor = (state = {isOpen: false}, action) =>{

    switch(action.type){

        case types.TOGGLE_NAVBAR: {
            return {...state,
                isOpen: action.payload.isOpen
            }
        }

        case types.REQUEST_CONTACT: {
            return {...state,
                contact_submitted: true
            }
        }

        case types.FAILURE_CONTACT:
        case types.SUCCESS_CONTACT: {
            return {...state,
                contact_notification: action.payload
            }
        }

        case types.REQUEST_SUBSCRIBE: {
            return {...state,
                submitRequest: true
            }
        }

        case types.FAILURE_SUBSCRIBE:
        case types.SUCCESS_SUBSCRIBE: {
            return {
                submit_notification: action.payload
            }
        }

        default:
            return state
    }
}

export default visitor