import * as types from './types'
import {apiConfig} from "../../config";
import ApiClient from '../services/api/ApiClient'
const apiClient = new ApiClient()

const tokenKey = "id_token"
const dashboardUrl = "/dashboard"

export const requestLogin = user => ({ type: types.LOGIN_REQUEST, payload: user }) 

export const successLogin = token => ({ type: types.LOGIN_SUCCESS, payload: token })

export const loginFailure = message => ({ type: types.LOGIN_FAILURE, payload: message })

export const requestLogout = () => ({ type: types.LOGOUT })

export const logout = (history) => {
    
    return dispatch => {
        dispatch(requestLogout())
        history.replace('/login');
        
        // Clear user token and profile data from localStorage
        localStorage.removeItem(tokenKey);
    }
}

export const loginUser = (email, password, history) => {

    if(isEmailValid(email) && password){
        
        return dispatch => {

            dispatch(request(email))
            
            return login(email, password)
                .then(handleErrors)
                .then(res => res.json())
                .then(json => {
                    const token = json.token
                    dispatch(successLogin(token))
                    setToken(token) // Setting the token in localStorage    
                    history.push(dashboardUrl) 
                })
                .catch(error => dispatch(loginFailure(error)))
        };
    }
}

function login(email, password) {
    return apiClient.post(apiConfig.customerLoginEndPoint, {email, password});
}

function loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken() // GEtting token from localstorage
    return !!token && !this.apiClient.isTokenExpired(token) // handwaiving here
}


function setToken(idToken) {
    // Saves user token to localStorage
    localStorage.setItem(tokenKey, idToken)
}

function getToken() {
    // Retrieves the user token from localStorage
    return localStorage.getItem(tokenKey)
}

function getProfile() {
    try{
        // Using jwt-decode npm package to decode the token
        return decode(this.getToken());

    }catch (e) {
        return null
    }
}