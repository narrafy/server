import * as types from './types'
import ApiClient from '../services/api/ApiClient'
import { conversation } from "../config";

export const startConversation = () => ({type: types.START_CONVERSATION , payload: []})

export const userTyping = text => ({type: types.USER_TYPING, text})

export const sendMessage = (sender, text, ctx) => ({type: types.SEND_MESSAGE, payload: postMessage(sender, text, ctx) })

export const postQuickReplyMessage = (sender, text, ctx) => ({type: types.POST_QUICK_REPLY_MESSAGE, payload: postMessage(sender, text, ctx) })

const saveMessage = (msg) => ({type: types.SAVE_MESSAGE, payload: msg })

const receiveMessage = (msg) => ({type: types.RECEIVE_MESSAGE, payload : msg})

const startTyping = delay => ({ type: types.START_TYPING, payload: delay })

const endTyping = () => ({ type: types.END_TYPING })

function postMessage(sender, text, ctx) {

    let msg = {
        message: { senderId: sender, text},
        context: ctx,
        input: {text}
    }

    return dispatch => {

        dispatch(saveMessage(msg)) //save the user message into local state
        dispatch(startTyping(1000)) // wait for 1 second and launch the server typing icon

        return callApi(msg).
            then(res => {
                dispatch(endTyping())
                    let serverMessage = {
                        message: {
                            senderId: res.data.server,
                            text: res.data.output.text,
                            quick_replies: res.data.context.quick_replies
                        },
                        context: res.data.context,
                        input: res.data.input
                    }
                dispatch(receiveMessage(serverMessage)) //save the server message into local state

            }).catch(err => console.log(err))
    }
}

const callApi = (msg) => {
    return ApiClient.post(conversation.sendMessageEndPoint, msg)
}
