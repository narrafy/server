import React, {Component} from 'react'
import QuickReply from './QuickReply'
import {connect} from "react-redux";

class QuickReplyMessage extends Component {

    render() {

        const {show_quick_reply, username, text, quickReplies} = this.props

        if(!show_quick_reply) {
            return (
                <div className="message-inner">
                    <div className="message-username">{username}</div>
                    <p> {text} </p>
                </div>
            )
        }

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

const mapStateToProps = state => {
    return { show_quick_reply: state.show_quick_reply }
}

export default connect(mapStateToProps)(QuickReplyMessage)

