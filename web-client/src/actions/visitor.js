import * as types from './types'
import {apiConfig} from "../config";
import ApiClient from '../services/api/ApiClient'
const apiClient = new ApiClient()

export const requestContact = (name, email, message) => ({ type: types.CONTACT_REQUEST, payload: { name, email, message} })

export const successContact = message => ({ type: types.CONTACT_SUCCESS, payload: message })

export const failureContact = message => ({ type: types.CONTACT_FAILURE, payload: message })

export const requestSubscribe = email => ({ type: types.SUBMIT_REQUEST, payload: email })

export const successSubscribe = message => ({ type: types.SUBMIT_SUCCESS, payload: message })

export const failureSubscribe = message => ({ type: types.SUBMIT_FAILURE, payload: message })

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