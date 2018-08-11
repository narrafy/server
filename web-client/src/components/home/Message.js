import React from 'react'

function Message(props) {
    return (
        <div className="message-inner">
            <div className="message-username">{props.username}</div>
            <p> {props.text} </p>
        </div>
    )
}

export default Message