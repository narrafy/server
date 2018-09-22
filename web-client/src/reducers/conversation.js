import * as types from "../_constants/conversation.constants"

const conversation = (state = { messages: [] }, action) => {
    
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

        case types.REQUEST_CONVERSATION_AVG: {
            return {...state,
                avg_loading: true
            }
        }

        case types.SUCCESS_CONVERSATION_AVG: {
            return {...state,
                avg_loading: false,
                avg: action.payload.avg,
            }
        }
        case types.FAILURE_CONVERSATION_AVG: {
            return {...state,
                avg_loading: false,
                error: action.payload
            }
        }

        case types.REQUEST_CONVERSATION_DATASET: {
            return {...state,
                dataset_loading: true
            }
        }

        case types.SUCCESS_CONVERSATION_DATASET: {
            return {...state,
                dataset_loading: false,
                xQuestions: action.payload.xQuestions,
                yMinutes: action.payload.yMinutes,
                count: action.payload.count
            }
        }

        case types.FAILURE_CONVERSATION_DATASET: {
            return {...state,
                dataset_loading: false,
                error: action.payload
            }
        }

        default:
            return state
    }
}

export default conversation

