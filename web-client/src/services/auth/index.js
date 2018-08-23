import decode from 'jwt-decode';
import ApiClient from '../api/ApiClient'
import {apiConfig} from "../../config";

export default class Auth {
    // Initializing important variables
    constructor() {
        this.login = this.login.bind(this)
        this.getProfile = this.getProfile.bind(this)
        this.getToken = this.getToken.bind(this)
        this.loggedIn = this.loggedIn.bind(this)
        this.apiClient = new ApiClient();
    }

    login(email, password, redirect) {
        // Get a token from api server using the fetch api
        let cb  = (res) => {
            this.setToken(res.data.token) // Setting the token in localStorage
            redirect()
        }
        this.apiClient.post(apiConfig.customerLoginEndPoint, {email, password}, cb);
    }

    loggedIn() {
        // Checks if there is a saved token and it's still valid
        const token = this.getToken() // GEtting token from localstorage
        return !!token && !this.apiClient.isTokenExpired(token) // handwaiving here
    }


    setToken(idToken) {
        // Saves user token to localStorage
        localStorage.setItem('id_token', idToken)
    }

    getToken() {
        // Retrieves the user token from localStorage
        return localStorage.getItem('id_token')
    }

    logout() {
        // Clear user token and profile data from localStorage
        localStorage.removeItem('id_token');
    }

    getProfile() {
        try{
            // Using jwt-decode npm package to decode the token
            return decode(this.getToken());

        }catch (e) {
            return null
        }
    }
}
