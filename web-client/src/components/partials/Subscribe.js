import React, {Component} from 'react'
import {connect} from 'react-redux'
import {subscribe} from '../../actions/visitor'
import {isEmailValid} from '../../utils'

class Subscribe extends Component
{
    constructor(){
        
        super()
        this.state = {
            email: '',
        }
        
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    handleSubmit(e)
    {
        e.preventDefault();
        const { email } = this.state
        if(isEmailValid(email))
        {
            this.props.dispatch(subscribe(email))
            this.setState({
                email: ""
            })
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

        const {submit_notification} = this.props
        const {email} = this.state

        if(submit_notification)
        {
            return(
                <section id="subscribe">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12 text-center">
                                <p>
                                    { submit_notification }
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            )
        } else {
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
                                               name="email" type="email" value = {email}
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
const mapStateToProps = state => {
    const {submit_notification} = state.visitor
    return {submit_notification}
}

export default connect(mapStateToProps)(Subscribe) 