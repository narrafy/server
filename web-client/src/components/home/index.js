import React, {Component} from 'react';
import ChatContainer from './ChatContainer'
import Footer from '../partials/Footer'

class Home extends Component {
    render(){
        return (
            <div>
                <ChatContainer/>
                <Footer/>
            </div>
        )
    }
}

export default Home;