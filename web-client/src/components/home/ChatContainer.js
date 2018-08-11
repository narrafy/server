import React from 'react'
import MessageList from './MessageList'
import SendMessageForm from './SendMessageForm'
import axios from "axios";

class ChatContainer extends React.Component
{

    constructor(){
        super()
        this.state = {
            messages: [],
            input: {
                text: '',
            },
            context: {
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
                this.updateState("Narrafy",
                    res.data.output.text,
                    res.data.context, res.data.context.quick_replies)
            })
            .catch(err => console.log(err));
    }

    updateState(sender, text, context, quick_replies)
    {
        const message = {
            senderId: sender,
            text: text,
            quick_replies: quick_replies
        }
        this.setState({ messages: [...this.state.messages, message], context: context })
    }

    async sendMessage(text){
        let context = this.state.context

        this.updateState("You", text, context, '')
        const data = {
            input: {text},
            context: context
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
        return(
            <section id="chatbot">
                <div className="chat-container">
                    <MessageList messages={this.state.messages} sendMessage = {this.sendMessage} />
                    <SendMessageForm sendMessage = {this.sendMessage} />
                </div>
            </section>
        )
    }
}

export default ChatContainer