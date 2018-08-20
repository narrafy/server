import React from 'react'

export default function Message(props) {
    return (
        <div className="message-inner">
            <div className="message-username">{props.username}</div>
            <p> {props.text} </p>
        </div>
    )
}