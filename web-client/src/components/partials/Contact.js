import React, {Component} from 'react'
import contactLogo from '../../assets/img/contact.jpg'
import {contact} from '../../actions/visitor'
import {isEmailValid} from '../../utils'
import { connect } from 'react-redux';

class Contact extends Component
{
    constructor()
    {
        super()
        this.state = {
            name: '',
            email: '',
            message: ''
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    handleSubmit(e)
    {
        e.preventDefault();
        const {name, email, message} = this.state
        if(isEmailValid(email)){
            this.props.dispatch(contact(name, email, message))
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

    render()
    {
        const {contact_notification} = this.props
        const {name, email, message} = this.state

        const ContactLogo = () =>
        {
            return ( <img src={contactLogo} alt = "icon" className="team img-responsive" />)
        }

        if(contact_notification){
            return(
                <section id="contact" className="section-secondary">
                    <div className="container">
                        <h2> Contact </h2>
                        <div className="row row-eq-height">
                            <div className="col-md-2 ">
                                <ContactLogo/>
                            </div>
                            <div className="col-md-8 ">
                                <div id="email-notification">
                                    <p className="text-center big">
                                        {contact_notification}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )
        }else{
            return(
                <section id="contact" className="section-secondary">
                    <div className="container">
                        <h2> Contact </h2>
                        <div className="row row-eq-height">
                            <div className="col-md-2 ">
                                <ContactLogo/>
                            </div>
                            <div className="col-md-8 ">
                                <div id="contact-form">
                                    <form onSubmit={this.handleSubmit}>
                                        <div className="form-group">
                                            <input id="name-box" type="name" name="name"
                                                   className="form-input-text form-control" placeholder="Name"
                                                   required value={name}
                                                   onChange={this.handleChange} />
                                        </div>
                                        <div className="form-group">
                                            <input id="email-box" type="email" name="email"
                                                   className="form-input-text form-control" placeholder="Email"
                                                   required value={email}
                                                   onChange={this.handleChange} />
                                        </div>
                                        <div className="form-group">
                                            <textarea id="contact-box"
                                              name="message"
                                              className="form-input-text form-control"
                                              rows="4"
                                              placeholder="Message"
                                              value = {message}
                                              onChange={this.handleChange}
                                              required ></textarea>
                                        </div>
                                        <div className="form-group send-button">
                                            <button type="submit" onSubmit={this.handleSubmit}
                                                    className="btn  btn-primary">Send Message
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )
        }
    }
}

const mapStateToProps = state => {
    const {contact_notification} = state.visitor
    return {
        contact_notification
    }
}

export default connect(mapStateToProps)(Contact) 