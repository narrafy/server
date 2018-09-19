import axios from "axios"
import {isValidToken} from '../../utils'

export default class ApiClient{

    constructor(){
        this.post = this.post.bind(this)
        this.get = this.get.bind(this)
        this.getHeaders = this.getHeaders.bind(this)
    }

    getHeaders(token){
        // performs api calls sending the required authentication headers
        let headers = {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        }

        // Setting Authorization header
        // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
        if (isValidToken(token)) {
            headers['Authorization'] = 'Bearer ' + token
        }
        return headers
    }

    post(endPoint, data, token=null)
    {
        let headers = this.getHeaders(token)
        let options = {headers}
        return axios.post(endPoint, data, options)
    }


    fetch(endPoint, msg, token=null){
        return fetch(endPoint, {
            method: 'post',
            headers: this.getHeaders(token),
            body: JSON.stringify(msg)
        })
    }

    get(endPoint, token = null)
    {
        return fetch(endPoint, {
            method: 'get',
            headers: this.getHeaders(token)
        })
    }
}