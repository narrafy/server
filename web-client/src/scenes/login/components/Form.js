import React, { Component } from 'react';
import {withRouter} from 'react-router'
import {connect} from 'react-redux'
import {isEmailValid} from '../../../utils/index'
import {loginUser} from '../../../actions/authentication'
import { FormGroup, Label, Input, FormText, FormFeedback } from 'reactstrap'

class LoginForm extends Component {

    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            validate: {
                emailState: '',
                formState: true
            },
        }

        this.handleChange = this.handleChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.validateEmail = this.validateEmail.bind(this);
    }

    validateEmail(e) {
        const { validate } = this.state
        if (isEmailValid(e.target.value)) {
            validate.emailState = 'has-success'
        } else {
            validate.emailState = 'has-danger'
        }
        this.setState({ validate })
    }

    handleChange =  (event) => {
        const { target } = event;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const { name } = target;
        this.setState({
            [ name ]: value,
        });
    }

    submitForm(e) {
        e.preventDefault();
        const { email, password } = this.state
        const { dispatch, history } = this.props
        dispatch(loginUser(email, password, history))
    }

    componentWillMount(){
        const { profile, history } = this.props
        if(profile){
            history.replace("/dashboard")
        }
    }

    render() {
        const { email, password } = this.state;
        return (
            <form  className="form" onSubmit={ (e) => this.submitForm(e)}>
                <FormGroup className="offset-1">
                <Label className="text-center">Email or Key</Label>
                <Input
                    type="email"
                    name="email"
                    placeholder=""
                    value={ email }
                    valid={ this.state.validate.emailState === 'has-success' }
                    invalid={ this.state.validate.emailState === 'has-danger' }
                    onChange={ (e) => {
                        this.validateEmail(e)
                        this.handleChange(e)
                    } }
                />
                <FormFeedback valid>
                    The email is valid.
                </FormFeedback>
                <FormFeedback>
                    Looks like there is an issue with your email. Please input a correct email.
                </FormFeedback>
                <FormText>Your username is most likely your email.</FormText>
            </FormGroup>
            <FormGroup className="offset-1">
                <Label for="examplePassword">Password</Label>
                <Input
                    type="password"
                    name="password"
                    id="examplePassword"
                    placeholder=""
                    value={ password }
                    onChange={ (e) => this.handleChange(e) }
                />
            </FormGroup>
             {
                 this.state.validate.formState === false &&
                 <FormText className="invalid-feedback">Please input valid credentials.</FormText>
             }
            <input className="btn btn-secondary btn-subscribe float-right" id="submit-login" type="submit" value="Submit" onSubmit={this.submitForm} />
        </form>
        );
    }
}

const mapStateToProps = state => {
    const { profile } = state.auth
    return { profile }
}

export default withRouter(connect(mapStateToProps)(LoginForm))