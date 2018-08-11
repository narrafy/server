import React, {Component} from 'react';
import {hot} from "react-hot-loader";
import ChatContainer from './components/home/ChatContainer'
import NavigationBar from './components/partials/NavigationBar'
import "./App.css"

class App extends Component {
    render(){
        return (
            <div>
                <NavigationBar/>
                <ChatContainer/>
            </div>
        )
    }
}

export default hot(module)(App);