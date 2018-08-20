import React, {Component} from 'react';
import ChatContainer from '../chat/ChatContainer'
import Footer from '../partials/Footer'
import ReactGA from 'react-ga'

class Home extends Component {

    constructor()
    {
        super()
        ReactGA.pageview(window.location.pathname + window.location.search)
    }

    render(){
        return (
            <ChatContainer/>
        )
    }
}

export default Home;