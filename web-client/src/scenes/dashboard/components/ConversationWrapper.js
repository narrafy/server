import React from 'react'
import MessageList from '../../../components/chat/MessageList'

export default function ConversationWrapper(props){
    return(<MessageList messages = {props.messages} />)
}