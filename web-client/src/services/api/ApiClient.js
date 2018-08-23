import axios from "axios"
import decode from "jwt-decode";

export default class ApiClient{

    constructor(){
        this.post = this.post.bind(this)
        this.get = this.get.bind(this)
        this.isValidToken = this.isValidToken.bind(this)
        this.getHeaders = this.getHeaders.bind(this)
    }

    getHeaders(token){
        // performs api calls sending the required authentication headers
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

        // Setting Authorization header
        // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
        if (this.isValidToken(token)) {
            headers['Authorization'] = 'Bearer ' + token
        }

        return headers;
    }

    post(endPoint, data, cb, token=null)
    {
        let headers = this.getHeaders(token)
        let options = {headers}

        axios.post(endPoint, data, options)
            .then(res=>{
                cb(res)
            })
            .catch(err => console.log(err))
    }

    get(endPoint, cb, token = null)
    {
        let headers = this.getHeaders(token)
        let options = {headers}

        axios.get(endPoint, options)
            .then(res => {
                cb(res)
            })
    }

    isValidToken(token) {
        // Checks if there is a saved token and it's still valid
        return !!token && !this.isTokenExpired(token) // handwaiving here
    }

    isTokenExpired(token) {
        try {
            const decoded = decode(token);
            if (decoded.exp < Date.now() / 1000) { // Checking if token is expired. N
                return true;
            }
            else
                return false;
        }
        catch (err) {
            return false;
        }
    }

}