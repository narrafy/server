import React, {Component} from 'react'
import FormLogin from './components/Form'

class Login extends Component {
        render(){
                return (
                        <div className="login-container">
                                <div className={"row justify-content-md-center"}>
                                        <div className="col-md-7">
                                                <div className="card">
                                                        <div className="card-body">
                                                                <h5 className="card-title text-center">Login</h5>
                                                                <p className="card-text text-center">to continue your work.</p>
                                                                <FormLogin />
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                        </div>
                )
        }
}

export default Login