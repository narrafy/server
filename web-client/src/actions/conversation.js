import * as types from './types'
import ApiClient from '../services/api/ApiClient'
import { conversation } from "../config"
const apiClient = new ApiClient()

export function startConversation() {

    let text = '';
    let msg = {
        message: { senderId: null, text},
        context: initialCtx,
        input: {text}
    }

    return dispatch => {
        dispatch(serverTyping(1000));
        return callApi(msg)
            .then(handleErrors)
            .then(res => res.json())
            .then(json => {
                const reply = parseServerResponse(json)
                dispatch(serverEndTyping())
                dispatch(saveMessage(reply))
                return reply;
            })
            .catch(error => dispatch(handleErrors(error)))
    };
}

//a user sends a message to the server
export function postMessage(sender, text, ctx) {

    let msg = {
        message: { senderId: sender, text},
        context: ctx,
        input: {text}
    }

    return dispatch => {
        dispatch(userStopTyping())
        dispatch(saveMessage(msg))
        setTimeout(() => {
            dispatch(serverTyping())
        }, 500)

        return callApi(msg)
            .then(handleErrors)
            .then(res => res.json())
            .then(json => {
                const reply = parseServerResponse(json)
                const replyLength = reply.message.text.length * 30 // purposely delay the reply, to create a good user xp
                console.log(replyLength)
                setTimeout(() => {
                    dispatch(saveMessage(reply))
                    dispatch(serverEndTyping())
                    return json.data;
                }, replyLength)
            })
            .catch(error => dispatch(handleErrors(error)));
    };
}

export const requestConversationAvg = () => ({
    type: types.REQUEST_CONVERSATION_ANALYTICS
})

export const requestConversationDataSet = () => ({
    type: types.REQUEST_CONVERSATION_DATASET
})

export const receiveConversationAvg = avg => ({
    type: types.RECEIVE_CONVERSATION_ANALYTICS,
    payload: avg
})

export const receiveConversationDataSet = (xMinutes, yQuestions, count) => ({
    type: types.RECEIVE_CONVERSATION_DATASET,
    payload: {xMinutes, yQuestions, count}
})

export function fetchConversationDataSet(token){
    return dispatch => {
        dispatch(requestConversationAnalytics())
        dispatch(requestConversationDataSet())
        return apiClient.get(conversation.analytics.dataSetEndPoint, token)
            .then(handleErrors)
            .then(res => res.json())
            .then(json => {
                let x = []
                let y = []
                for(let item in json){
                    x.push(json[item].minutes)
                    y.push(json[item].counter)
                }
                let count = json.length
                dispatch(receiveConversationDataSet(x,y, count))
            })
            .catch(error => dispatch(handleErrors(error)))
    }
}

export function fetchConversationAvg(token){

    return dispatch => {
    
        dispatch(requestConversationAvg())
        
        return apiClient.get(conversation.analytics.avgEndPoint, token)
            .then(handleErrors)
            .then(res => res.json())
            .then(json => {
                if(json.counter && json.minutes){
                    let avg = { questions: json.counter.toFixed(2), minutes: json.minutes.toFixed(2)}
                    dispatch(receiveConversationAvg(avg))                   
                }
            })
            .catch(error => dispatch(handleErrors(error)))
    }
}

export const userStartTyping = text => ({type: types.USER_TYPING, text})

export const quickButtonClick = text => ({type: types.QUICK_BUTTON_CLICK, text})

const userStopTyping = () => ({type: types.USER_END_TYPING})

const saveMessage = (msg) => ({type: types.SAVE_MESSAGE, payload: msg })

const serverTyping = () => ({ type: types.SERVER_TYPING })

const serverEndTyping = () => ({ type: types.SERVER_END_TYPING })

const callApi = (msg) => {
    return apiClient.fetch(conversation.sendMessageEndPoint, msg)
}

function parseServerResponse(data){

    return {
        input: data.input,
        context: data.context,
        message: {
            senderId: data.server,
            text: data.output.text,
            quick_replies: data.context.quick_replies
        }
    }
}

// Handle HTTP errors since fetch won't.
function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

const initialCtx = {
    customer_id : conversation.customer_id,
    web_user : true
}