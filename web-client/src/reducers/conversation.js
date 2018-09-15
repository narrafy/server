import * as types from "../actions/types"

const conversationReducer = (state = {
    messages: []
}, action) => {
    switch (action.type){
        case types.RECEIVE_MESSAGE:
        case types.SAVE_MESSAGE: {
            return {...state,
                messages: [...state.messages, action.payload.message],
                context: action.payload.context,
                input: action.payload.input
                }
        }

        case types.USER_TYPING: {
            return {...state,
                current_message: action.text
            }
        }
        case types.QUICK_BUTTON_CLICK: {
            return {...state,
                current_message: action.text
            }
        }

        case types.USER_END_TYPING: {
            return {...state,
                current_message: '',
                isServerTyping: true
            }
        }

        case types.SERVER_TYPING: {
            return {...state,
                isServerTyping: true
            }
        }

        case types.SERVER_END_TYPING: {
            return {...state,
                isServerTyping: false
            }
        }

        default:
            return state
    }
}

export default conversationReducer

