import React, {Component} from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPaperPlane} from '@fortawesome/free-solid-svg-icons'
import ApiClient from "../../api/ApiClient"
import {subscribeEndPoint} from '../../config'
import {Form, FormGroup, Label, Input, Button, Row, Col} from 'reactstrap'

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
        let cb = () =>{
            this.setState({
                isSubscribed: true
            })
        }

        const data = {
            email: this.state.email
        }

        this.apiClient.post(subscribeEndPoint, data, cb)
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
                            <div className="col-md-12 text-center">
                                <h2 className="title">Sign up</h2>
                                <form onSubmit={this.handleSubmit}>
                                    <div id="subscribe-div" className="form-inline col-md-6 offset-md-3 text-center"
                                     role="form">
                                        <div className="form-group">
                                        <input className="form-control" id="subscribe-box"
                                               onChange={this.handleChange}
                                               onKeyDown={this.handleChange}
                                               placeholder="Your Email" name="email" type="text" />
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
                </section>
            )
        }
    }
}

export default Subscribe