import React from "react"
import axios from "axios"

export default class ApiClient{

    constructor(){
        this.defaultOptions = {headers: {'Content-Type': 'application/json'}};
        this.post = this.post.bind(this)
        this.get = this.get.bind(this)
    }

    post(endPoint, data, cb)
    {
        axios.post(endPoint, data, this.defaultOptions)
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

}