import React, {Component} from 'react'
import ApiClient from '../../api/ApiClient'
import {apiConfig} from '../../config'
import contactLogo from '../../assets/contact.jpg'

class Contact extends Component
{
    constructor()
    {
        super()

        this.state = {
            name: '',
            email: '',
            message: '',
            isSubmitted: false
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
                isSubmitted: true
            })
        }

        const data = {
            name: this.state.name,
            message: this.state.message,
            email: this.state.email
        }
        this.apiClient.post(apiConfig.contactEndPoint, data, cb)
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

        const ContactLogo = () =>
        {
            return ( <img src={contactLogo} alt="icon" className="team img-responsive" />)
        }

        if(this.state.isSubmitted){
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
                                        Thank you for your message. We will get back to you shortly.
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
                                                   required value={this.state.name}
                                                   onChange={this.handleChange} />
                                        </div>
                                        <div className="form-group">
                                            <input id="email-box" type="email" name="email"
                                                   className="form-input-text form-control" placeholder="Email"
                                                   required value={this.state.email}
                                                   onChange={this.handleChange} />
                                        </div>
                                        <div className="form-group">
                                            <textarea id="contact-box"
                                              name="message"
                                              className="form-input-text form-control"
                                              rows="4"
                                              placeholder="Message"
                                              value = {this.state.message}
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

export default Contact