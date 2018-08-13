import React from "react"
import axios from "axios"

export default class ApiClient{

    constructor(){
        this.defaultOptions = {headers: {'Content-Type': 'application/json'}};
        this.post = this.post.bind(this)
    }

    post(config, data, cb)
    {
        axios.post(config.apiUrl, data, this.defaultOptions)
            .then(res=>{
                cb(res)
            })
            .catch(err => console.log(err));
    }

}