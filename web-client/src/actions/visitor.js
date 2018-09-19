import * as types from './types'
import {apiConfig} from "../config";
import ApiClient from '../services/api/ApiClient'
const apiClient = new ApiClient()

export const requestContact = (name, email, message) => ({ type: types.REQUEST_CONTACT, payload: { name, email, message} })

export const successContact = message => ({ type: types.SUCCESS_CONTACT, payload: message })

export const failureContact = message => ({ type: types.FAILURE_CONTACT, payload: message })

export const requestSubscribe = email => ({ type: types.REQUEST_SUBSCRIBE, payload: email })

export const successSubscribe = message => ({ type: types.SUCCESS_SUBSCRIBE, payload: message })

export const failureSubscribe = message => ({ type: types.FAILURE_SUBSCRIBE, payload: message })

export const toggleNavbar = () => ({type: types.TOGGLE_NAVBAR })

export function contact(name, email, message){

    return dispatch => {
        const data = { name, email, message }
        dispatch(requestContact())
        return apiClient.post(apiConfig.contactEndPoint, data)
        .then(handleErrors)
                .then(res => res.json())
                .then(json => {
                    dispatch(successContact(json))
                })
                .catch(error => dispatch(failureContact(error)))
    }
}

export function subscribe(email){
    return dispatch => {
        dispatch(requestSubscribe())
        return apiClient.post(apiConfig.subscribeEndPoint, email)
        .then(handleErrors)
                .then(res => res.json())
                .then(json => {
                    dispatch(successSubscribe(json))
                })
                .catch(error => dispatch(failureSubscribe(error)))
    }
}

// Handle HTTP errors since fetch won't.
function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}