import React, {Component} from 'react';
import ReactGA from 'react-ga'

export default class Login extends Component {

    constructor()
    {
        super()
        ReactGA.pageview(window.location.pathname + window.location.search)
    }

    render(){
        return (
            <div>

            </div>
        )
    }
}