import axios from "axios"
import decode from "jwt-decode";

export default class ApiClient{

    constructor(){
        this.post = this.post.bind(this)
        this.get = this.get.bind(this)
    }

    post(endPoint, data, cb)
    {

        // performs api calls sending the required authentication headers
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

        // Setting Authorization header
        // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
        if (this.isValidToken()) {
            headers['Authorization'] = 'Bearer ' + this.getToken()
        }

        let options = {headers};

        axios.post(endPoint, data, options)
            .then(res=>{
                cb(res)
            })
            .catch(err => console.log(err));
    }

    get(endPoint, cb)
    {
        axios.get(endPoint, cb)
            .then(res => {
                cb(res)
            })
    }

    isValidToken() {
        // Checks if there is a saved token and it's still valid
        const token = this.getToken() // GEtting token from localstorage
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

    getToken() {
        // Retrieves the user token from localStorage
        return localStorage.getItem('id_token')
    }

}