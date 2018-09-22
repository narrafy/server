import React, {Component} from 'react'
import {connect} from 'react-redux'
import { loadThread } from '../../../actions/thread'
import {getToken} from '../../../utils/index'
import MessageList from '../../../components/chat/MessageList'


class ConversationContainer extends Component{


    componentDidMount()
    {
        const token = getToken()
        const { dispatch, activeThread } = this.props
        dispatch(loadThread(activeThread, token))
    }

    render() {
        const {messages} = this.props
        return(<MessageList messages = {messages} />)
    }

}

const mapStateToProps = state =>{
    
    const {messages} = state.thread
    
    return {
        messages
    }
}

export default connect(mapStateToProps)(ConversationContainer) 


