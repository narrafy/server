import React, {Component} from 'react';
import ChatContainer from './ChatContainer'
import NavigationBar from '../partials/NavigationBar'
import Footer from '../partials/Footer'

class Home extends Component {
    render(){
        return (
            <div>
                <NavigationBar/>
                <ChatContainer/>
                <Footer/>
            </div>
        )
    }
}

export default Home;