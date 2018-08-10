import React from 'react';
import MessageList from './components/MessageList'
import SendMessageForm from './components/SendMessageForm'

class App extends React.Component {

    constructor(){
        super()
        this.state = {
            messages: []
        }
        this.sendMessage = this.sendMessage.bind(this)
    }

    sendMessage(text){

    }

    componentDidMount()
    {
        let message;
        this.setState({
            messages: [...this.state.messages, message]
        })
    }

    render(){
        return (
            <div className="app">
                <MessageList messages={this.state.messages} />
                <SendMessageForm sendMessage = {this.sendMessage} />
            </div>
        )
    }
}