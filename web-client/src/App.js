import React, {Component} from 'react';
import axios from "axios";
import {hot} from "react-hot-loader";
import MessageList from './components/MessageList'
import SendMessageForm from './components/SendMessageForm'
import "./App.css"

class App extends Component {

    constructor(){
        super()
        this.state = {
            messages: [],
            input: {
                text: '',
            },
            context: {
                quick_replies : '',
                customer_id : "378327679207724",
                web_user : true
            }
        }
        this.sendMessage = this.sendMessage.bind(this)
        this.updateState = this.updateState.bind(this)
        this.callApi = this.callApi.bind(this)
        this.apiUrl = "/api/message";
        this.defaultOptions = {headers: {'Content-Type': 'application/json'}};
    }

    callApi(data)
    {
        axios.post(this.apiUrl, data, this.defaultOptions)
            .then(res=>{
                this.updateState("Narrafy", res.data.output.text, res.data.context)
            })
            .catch(err => console.log(err));
    }

    updateState(sender, text, context)
    {
        const message = {
            senderId: sender,
            text: text,
        }
        this.setState({ messages: [...this.state.messages, message], context: context })
    }

    async sendMessage(text){

        this.updateState("Client", text, this.state.context)
        const data = {
            input: {text},
            context: this.state.context
        }
        this.callApi(data)
    }

    componentDidMount()
    {
        const data = {
            context: this.state.context,
            input: this.state.input
        }

        this.callApi(data)
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

export default hot(module)(App);