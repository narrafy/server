import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import Message from './Message'
import QuickReplyMessage from './QuickReplyMessage'

export default class MessageList extends Component{

    componentWillUpdate(){
        const node = ReactDOM.findDOMNode(this)
        this.shouldScrollToBottom = node.scrollTop + node.clientHeight + 100 >= node.scrollHeight
    }

    componentDidUpdate(){
        if(this.shouldScrollToBottom)
        {
            const node = ReactDOM.findDOMNode(this)
            node.scrollTop = node.scrollHeight
        }
    }

    render(){
        return (
            <div className="message-list">
                <div className="segments load">
                    {this.props.messages.map((message, index) => {

                        let className = "from-" + message.senderId;
                        if(message.quick_replies)
                        {
                            return (
                                <div key={index} className={className}>
                                    <QuickReplyMessage class="message-inner"
                                             quickReplies={message.quick_replies}
                                             username={message.senderId}
                                             text={message.text}
                                             sendMessage={this.props.sendMessage}
                                    />
                                </div>
                            )
                        }else{
                            return (
                                <div className={className}>
                                    <Message key={index} class="message-inner"
                                             username={message.senderId}
                                             text={message.text}
                                    />
                                </div>
                            )
                        }
                    })}
                </div>
            </div>
        )
    }
}