import React from 'react'
import MessageList from '../../../components/chat/MessageList'

export default function ConversationContainer(props){
    return(<MessageList messages = {props.messages} />)
}