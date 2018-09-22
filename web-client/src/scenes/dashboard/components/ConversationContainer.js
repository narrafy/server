import React, {Component} from 'react'
import {connect} from 'react-redux'
import MessageList from '../../../components/chat/MessageList'


class ConversationContainer extends Component{

    render() {
        const {messages} = this.props
        return(<MessageList messages = {messages} />)
    }

}

const mapStateToProps = state =>{
    
    const { messages } = state.thread

    return { messages}
}

export default connect(mapStateToProps)(ConversationContainer) 


