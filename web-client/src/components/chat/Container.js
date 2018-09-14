import React, {Component} from 'react'
import {connect} from 'react-redux'
import MessageList from './MessageList'
import SendMessageForm from './SendMessageForm'
import { startConversation } from '../../actions'

class Container extends Component
{
    componentDidMount()
    {
        this.props.dispatch(startConversation())
    }

    render(){
        return(
            <section id="chatbot">
                <div className="chat-container">
                    <MessageList />
                    <SendMessageForm />
                </div>
            </section>
        )
    }
}

const mapStateToProps = state => {
    return { }
}

export default connect(mapStateToProps)(Container)

