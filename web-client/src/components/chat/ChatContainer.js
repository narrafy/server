import React, {Component} from 'react'
import MessageList from './MessageList'
import SendMessageForm from './SendMessageForm'
import ApiClient from '../../api/ApiClient'
import {apiConfig} from '../../config/index'

export default class ChatContainer extends Component
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
        this.apiClient = new ApiClient()
        this.sendMessage = this.sendMessage.bind(this)
        this.updateState = this.updateState.bind(this)
        this.callApi = this.callApi.bind(this)

    }

    callApi(data)
    {
        let cb = res =>{
            this.updateState("Narrafy",
                res.data.output.text,
                res.data.context,
                res.data.context.quick_replies)
        }

        this.apiClient.post(apiConfig.sendMessageEndPoint, data, cb)
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
                    <MessageList messages = {this.state.messages} sendMessage = {this.sendMessage} />
                    <SendMessageForm sendMessage = {this.sendMessage} />
                </div>
            </section>
        )
    }
}
