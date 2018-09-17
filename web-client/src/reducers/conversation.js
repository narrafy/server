import * as types from "../actions/types"

const conversation = (state = {
    messages: []
}, action) => {
    switch (action.type){
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

        case types.REQUEST_CONVERSATION_ANALYTICS: {
            return { ...state,
                analytics_loading: true
            }
        }

        case types.RECEIVE_CONVERSATION_ANALYTICS: {
            return { ...state,
                analytics_loading: false,
                avg: action.payload.avg,
            }
        }

        case types.REQUEST_CONVERSATION_DATASET: {
            return { ...state,
                dataset_loading: true
            }
        }

        case types.RECEIVE_CONVERSATION_DATASET: {
            return { ...state,
                dataset_loading: false,
                xQuestions: action.payload.xQuestions,
                yMinutes: action.payload.yMinutes,
                count: action.payload.count
            }
        }

        default:
            return state
    }
}

export default conversation

