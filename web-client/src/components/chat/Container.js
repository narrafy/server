import React, {Component} from 'react'
import MessageList from './MessageList'
import SendMessageForm from './SendMessageForm'
import ApiClient from '../../services/api/ApiClient'
import {conversation} from '../../config/index'

export default class Container extends Component
{
    constructor(){
        super()
        this.state = {
            messages: [],
            input: {
                text: '',
            },
            context: {
                customer_id : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXN0b21lciI6eyJlbWFpbCI6ImRyb25pY0BuYXJyYWZ5LmlvIiwid29ya3NwYWNlIjoiZTAwZmJjMTAtOWU0Yy00NWNhLWIwMTgtOGQ0ZjA3ZjQwNTllIiwiYWNjZXNzX3Rva2VuIjoiRUFBUFM3bFB4R1A0QkFFdDhZU0NSNEUxUlBNM0ZoeHR3ZGx1d016eDFPbkRZODd2cHRpWkJaQk8xa3VpOWhkWkNHNnJDTThDbzVpVXNuWkNCYWRTOUltS3BpNlU3WDBNbm4xRnVJRUdUckViVU5aQXJoeGFjdlZHWkIxalVhdTQ4dWh5SWNjNFI2ZkVjZTFaQXJTZVpCS0xxYzg5bTJaQnJrMThneTB6TU5RNVhDR0FaRFpEIn0sImlhdCI6MTUzNDY0NzIzOCwiZXhwIjoxNTM1NTExMjM4fQ.CNOyzqzLsBJ8v1fB2-tSzws_UJHLXtWVEAhe2W7WgFs",
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

        this.apiClient.post(conversation.sendMessageEndPoint, data, cb)
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
