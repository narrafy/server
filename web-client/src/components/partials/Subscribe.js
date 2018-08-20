import React, {Component} from 'react'
import ApiClient from "../../api/ApiClient"
import {apiConfig} from '../../config'
import {isEmailValid} from '../../utils'

class Subscribe extends Component
{
    constructor(){
        super()

        this.state = {
            email: '',
            isSubscribed: false
        }
        this.apiClient = new ApiClient();
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    handleSubmit(e)
    {
        e.preventDefault();
        if(isEmailValid(this.state.email))
        {
            let cb = () =>{
                this.setState({
                    isSubscribed: true
                })
            }

            const data = {
                email: this.state.email
            }
            this.apiClient.post(apiConfig.subscribeEndPoint, data, cb)
        }
    }

    handleChange(e)
    {
        const target = e.target;
        const value = target.value;
        const name = target.name
        this.setState({
            [name]: value
        })
    }

    render(){
        if(this.state.isSubscribed)
        {
            return(
                <section id="subscribe">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12 text-center">
                                <p>
                                    We will contact you when there is something important.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            )
        }else{
            return(
                <section id="subscribe">
                    <div className="subscribe-container">
                        <div className="row">
                            <div className={"col-md-10 col-md-offset-4"}>
                                <h3 className="text-center">Sign up for our newsletter</h3>
                                <form className={"form-inline"} onSubmit={this.handleSubmit}>
                                    <div className={"form-group"}>
                                        <input className="form-control"
                                               id="subscribe-box"
                                               onChange={this.handleChange}
                                               placeholder="Your Email"
                                               name="email" type="email" value = {this.state.email}
                                               required />
                                    </div>
                                    <button type="submit" className="btn btn-secondary btn-subscribe"
                                            onClick={this.handleSubmit} >
                                        Submit
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            )
        }
    }
}

export default Subscribe