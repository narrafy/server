import React, { Component } from 'react';
import {withRouter} from 'react-router'
import {isEmailValid} from '../../../utils/index'
import {
    FormGroup, Label, Input,
    FormText, FormFeedback,
} from 'reactstrap';
import Auth from '../services/Auth'

class LoginForm extends Component {

    constructor(props) {
        super(props);
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
        this.auth = new Auth()
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
        if(isEmailValid(this.state.email) && this.state.password){
            try{
                this.auth.login(this.state.email, this.state.password, ()=>{
                    this.setState({
                        email: "",
                        password: ""
                    })
                    this.props.history.push("/dashboard");
                })
            }catch (e) {
                console.log(e.stack)
            }
        }else{
            this.setState({
                validate:{
                    formState : false
                }
            })
        }

    }

    componentWillMount(){
        if(this.auth.loggedIn()){
            this.props.history.replace("/dashboard")
        }
    }

    render() {
        const { email, password } = this.state;
        return (
            <div className="login-container">

                <div className={"row justify-content-md-center"}>
                    <div className="col-md-7">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title text-center">Login</h5>
                                <p className="card-text text-center">to continue your work.</p>
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
                                         this.state.validate.formState===false &&
                                         <FormText className="invalid-feedback">Please input valid credentials.</FormText>
                                     }
                                    <input className="btn btn-secondary btn-subscribe float-right" id="submit-login" type="submit" value="Submit" onSubmit={this.submitForm} />
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(LoginForm)