import React, {Component} from 'react'
import ApiClient from "../../api/ApiClient"
import {apiConfig} from '../../config'

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

    isEmailValid(email)
    {
        return email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
    }

    handleSubmit(e)
    {
        e.preventDefault();
        if(this.isEmailValid(this.state.email))
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
                                <div id="subscribe-notification">
                                    <p className="leave-email">
                                        We will contact you when there is something important.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )
        }else{
            return(
                <section id="subscribe">
                    <div className="container">
                        <div className="row">
                            <div className={"col-md-10 col-md-offset-3"}>
                                <div className="card ">
                                    <h3 className="card-title title text-center">Sign up for our newsletter</h3>
                                    <div className={"card-body"}>
                                        <form onSubmit={this.handleSubmit}>
                                            <div id="subscribe-div" className="form-inline col-md-6 offset-md-3 text-center">
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
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )
        }
    }
}

export default Subscribe