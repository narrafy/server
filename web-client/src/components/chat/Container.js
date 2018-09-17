import React, {Component} from 'react'
import { connect } from 'react-redux'
import MessageList from './MessageList'
import SendMessageForm from './SendMessageForm'
import TypingIndicator from './TypingIndicator'
import { startConversation } from '../../actions/conversation'

class Container extends Component
{
    componentDidMount()
    {
        this.props.dispatch(startConversation())
    }

    render(){
        const {messages, isLoading} = this.props
        return(
            <section id="chatbot">
                <div className="chat-container">
                    <MessageList messages = {messages} isLoading={isLoading} />
                    <TypingIndicator />
                    <SendMessageForm />
                </div>
            </section>
        )
    }
}

const mapStateToProps = state => {
    const {messages, isLoading} = state.conversation
    return { messages, isLoading }
}

export default connect(mapStateToProps)(Container)

