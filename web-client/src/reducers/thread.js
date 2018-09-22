import * as types from '../_constants/thread.constants'

const thread = (state = {threads: [], limit: 10, activePage: 0}, action) =>{

    switch(action.type){

        case types.REQUEST_THREAD_LIST : {
            return {...state,
                requestingList: true
            }
        }

        case types.SUCCESS_THREAD_LIST : {
            return {...state,
                requestingThreadList: false,
                threads: action.payload
            }
        }

        case types.FAILURE_THREAD_LIST : {
            return {...state,
                requestingThreadList: false,
                threadListError: action.payload
            }
        }

        case types.SET_ACTIVE_THREAD: {
            return {...state,
                activeThread: action.payload
            }
        }

        case types.REQUEST_THREAD: {
            return {...state,
                requestingActiveThread: true
            }
        }

        case types.SUCCESS_FETCH_THREAD: {
            return {...state,
                requestingActiveThread: false,
                messages: action.payload    
            }
        }

        case types.FAILURE_FETCH_THREAD: {
            return {...state,
                fetchThreadError: action.payload
            }
        }

        default:
            return state
    }
}

export default thread