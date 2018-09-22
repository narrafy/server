import * as types from '../_constants/auth.constants'
import {loginUrl, dashboardUrl, removeToken, setToken, tokenKey} from '../utils'
import {apiConfig} from "../config"
import ApiClient from '../services/api/ApiClient'
import { isEmailValid, handleErrors, getProfile} from '../utils'

const apiClient = new ApiClient()

export const requestLogin = user => ({ type: types.REQUEST_LOGIN, payload: user }) 

export const successLogin = profile => ({ type: types.SUCCESS_LOGIN, payload: profile })

export const loginFailure = error => ({ type: types.FAILURE_LOGIN, payload: error })

export const loginUser = (email, password, history) => {

    if(isEmailValid(email) && password){
        
        return dispatch => {

            dispatch(requestLogin(email))
            
            return login(email, password)
                .then(handleErrors)
                .then(res => res.json())
                .then(json => {
                    const token = json.token
                    setToken(token) // Setting the token in localStorage
                    const decoded = getProfile(token)
                    dispatch(successLogin(decoded.user))                     
                    history.push(dashboardUrl)
                })
                .catch(error => dispatch(loginFailure(error)))
        };
    }
}

export const requestLogout = () => ({ type: types.LOGOUT })

export const logout = (history) => {
    
    return dispatch => {
        dispatch(requestLogout())
        removeToken(tokenKey)
        history.replace(loginUrl);
    }
}

function login(email, password) {
    return apiClient.fetch(apiConfig.customerLoginEndPoint, {email, password});
}