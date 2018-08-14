import React, {Component} from 'react';
import {hot} from "react-hot-loader";
import ReactGA from 'react-ga'
import "./assets/App.css"
import {gaUa} from './config'

class App extends Component {

    constructor()
    {
        super()
        ReactGA.initialize(gaUa)
    }

    render(){
        return (
            <div />
        )
    }
}

export default hot(module)(App);