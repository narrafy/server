import * as types from '../actions/types'

const thread = (state = {threads: [], limit: 10, activePage: 1}, action) =>{

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

        case types.REQUEST_THREAD: {
            return {...state,
                activeThread: action.payload
            }
        }

        case types.SUCCESS_FETCH_THREAD: {
            return {...state,
                threads: action.payload    
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