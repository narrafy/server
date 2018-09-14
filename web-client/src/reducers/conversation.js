import * as types from "../actions/types"
import {conversation} from "../config";

const conversationReducer = (state = {
                                 messages: [],
                                 input: {
                                     text: '',
                                 },
                                 context: {
                                     customer_id : conversation.customer_id,
                                     web_user : true
                                 }
                             }, action) => {
    switch (action.type){
        case types.START_CONVERSATION:
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
        case types.POST_QUICK_REPLY_MESSAGE: {
            return {...state,
                messages: [...state.messages, action.payload.message],
                context: action.payload.context,
                input: action.payload.input,
                show_quick_reply: false
            }
        }

        case types.START_TYPING: {
            return {...state,
                isTyping: true
            }
        }

        case types.END_TYPING: {
            return {...state,
                isTyping: false
            }
        }

        default:
            return state
    }
}

export default conversationReducer

