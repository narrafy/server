import React, {Component} from 'react'
import QuickReply from './QuickReply'

class QuickReplyMessage extends Component {

    render() {
        const { username, text, quickReplies} = this.props
        return (
            <div className="message-inner">
                <div className="message-username">{username}</div>
                <p> {text} </p>
                {
                    quickReplies.map((reply, index) => {
                        return(
                            <QuickReply key={index} title = {reply.title} />
                        )
                    })
                }
            </div>
        )
    }
}

export default QuickReplyMessage

