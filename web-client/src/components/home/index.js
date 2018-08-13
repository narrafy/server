import React, {Component} from 'react';
import ChatContainer from '../chat/ChatContainer'
import Footer from '../partials/Footer'
import Subscribe from '../partials/Subscribe'

class Home extends Component {
    render(){
        return (
            <div>
                <ChatContainer/>
                <Subscribe/>
                <Footer/>
            </div>
        )
    }
}

export default Home;