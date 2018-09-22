import * as types from '../_constants/thread.constants'
import ApiClient from '../services/api/ApiClient'
import { conversation } from "../config"
import {handleErrors} from '../utils'
const apiClient = new ApiClient()

export const setActiveThread = (active_thread) => ({ type: types.SET_ACTIVE_THREAD, payload: active_thread })

export const requestThread = () => ({ type: types.REQUEST_THREAD})

export const successFetchThread = (messages) => ({ type: types.SUCCESS_FETCH_THREAD, payload: messages })

export const failureFetchThread = error => ({ type: types.FAILURE_FETCH_THREAD, payload: error })

export const loadThread = (thread_id, token) => {

    let url = conversation.threadEndPoint + thread_id

    return dispatch => {        
        dispatch(setActiveThread(thread_id))
        dispatch(requestThread(thread_id))
        
        return apiClient.get(url, token)
        .then(handleErrors)
        .then(res => res.json())
        .then(json => {
            console.log(json.data)
            let messages = parseResponse(json.data)
            dispatch(successFetchThread(messages))
        })
        .catch(error => dispatch(failureFetchThread(error)))        
    }
}

export const requestThreadList = () => ({ type: types.REQUEST_THREAD_LIST})

export const successFetchThreadList = threads => ({ type: types.SUCCESS_THREAD_LIST, payload: threads})

export const failureFetchThreadList = error => ({ type: types.FAILURE_THREAD_LIST, payload: error })

export const loadThreadList = (page, limit, token) =>
{
    let url = buildThreadListUrl( page, limit )

    return dispatch => {

        dispatch(requestThreadList())

        return apiClient.get(url, token)
        .then(handleErrors)
        .then(res => res.json())
        .then(json => {
            let threads = json.data
            if(threads && threads.length>0){
                dispatch(successFetchThreadList(threads))
            
                let activeThread = threads[0].conversation_id
                dispatch(loadThread(activeThread, token))
            }
        })
        .catch(error => dispatch(failureFetchThreadList(error)))
    }    
}

function buildThreadListUrl(page, limit){
    let offset = page * limit
    let url = conversation.threadListEndPoint + "?limit="+ 
    limit + "&offset=" + offset + "&counter=3" +
    "&minMinutes=0"
    return url
}

function parseResponse(data){
    let conversations=[]
    let n = data.length;
    // run a for loop for all data
        //convert to message object
    for(let k = 0; k < n ; k++){
        let item = data[k]    
        if(item.input && item.input.text){
            const userMessage = {
                    senderId: "User",
                    text: item.input ? item.input.text : ''
                }
                conversations.push(userMessage)
        }
        if(item.output && item.output.text){
            const serverMessage = {
                senderId: "Narrafy",
                text: item.output.text.length>0 ? item.output.text.join(' '): ''
                }
            conversations.push(serverMessage)
        }
    }
    return conversations
}