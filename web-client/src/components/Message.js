import React from 'react'
import QuickReply from './QuickReply'

function Message (props) {
        if(props.hasQuickReply)
        {
            return (
                <div className={props.class}>
                    <div className="message-username">{props.username}</div>
                    <div className="message-text"> {props.text} </div>
                    <QuickReply />
                </div>
            )
        }else {
            return (
                <div className={props.class}>
                    <div className="message-username">{props.username}</div>
                    <div className="message-text"> {props.text} </div>
                </div>
            )
        }
}

export default Message