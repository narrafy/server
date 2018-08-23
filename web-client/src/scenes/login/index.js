import React, {Component} from 'react'
import FormLogin from './components/Form'
import Auth from '../../services/auth'

 class Login extends Component {

        constructor(){
                super()
                this.auth = new Auth()
        }
        render(){
                return (<FormLogin login = {this.auth.login} loggedIn={this.auth.loggedIn} />)
        }
}

export default Login